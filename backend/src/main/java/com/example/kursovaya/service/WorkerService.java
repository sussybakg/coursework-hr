package com.example.kursovaya.service;

import com.example.kursovaya.dto.worker.WorkerRequest;
import com.example.kursovaya.dto.worker.WorkerResponse;
import com.example.kursovaya.dto.worker.WorkerStatsResponse;
import com.example.kursovaya.exception.FileUploadException;
import com.example.kursovaya.exception.UserNotFoundException;
import com.example.kursovaya.exception.WorkerAlreadyExistsException;
import com.example.kursovaya.exception.WorkerNotFoundException;
import com.example.kursovaya.mapper.WorkerMapper;
import com.example.kursovaya.model.User;
import com.example.kursovaya.model.Worker;
import com.example.kursovaya.model.WorkerHistory;
import com.example.kursovaya.repository.UserRepository;
import com.example.kursovaya.repository.WorkerHistoryRepository;
import com.example.kursovaya.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;
    private final WorkerHistoryRepository workerHistoryRepository;
    private final WorkerMapper mapper;

    @Value("${upload.path}")
    private String uploadPath;

    public List<WorkerResponse> getWorkers() {
        return workerRepository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    public WorkerStatsResponse getStats() {
        List<Worker> workers = workerRepository.findAll();

        long total = workers.size();
        Set<String> departments = new HashSet<>();
        Set<String> positions = new HashSet<>();
        List<Float> salaries = new ArrayList<>();
        List<java.time.LocalDate> hireDates = new ArrayList<>();

        for (Worker w : workers) {
            Optional.ofNullable(w.getDepartment()).filter(s -> !s.isBlank()).ifPresent(departments::add);
            Optional.ofNullable(w.getPosition()).filter(s -> !s.isBlank()).ifPresent(positions::add);
            Optional.ofNullable(w.getSalary()).ifPresent(salaries::add);
            Optional.ofNullable(w.getHireDate()).ifPresent(hireDates::add);
        }

        Float avgSalary = salaries.isEmpty() ? null :
                (float) salaries.stream().mapToDouble(Float::doubleValue).average().orElse(0);
        Float minSalary = salaries.stream().min(Float::compare).orElse(null);
        Float maxSalary = salaries.stream().max(Float::compare).orElse(null);

        hireDates.sort(Comparator.naturalOrder());
        java.time.LocalDate earliestHire = hireDates.isEmpty() ? null : hireDates.get(0);
        java.time.LocalDate latestHire = hireDates.isEmpty() ? null : hireDates.get(hireDates.size() - 1);

        List<WorkerStatsResponse.DepartmentStatItem> departmentStats = departments.stream()
                .map(dep -> {
                    List<Worker> inDep = workers.stream().filter(w -> dep.equals(w.getDepartment())).toList();
                    OptionalDouble avgOpt = inDep.stream()
                            .map(Worker::getSalary)
                            .filter(Objects::nonNull)
                            .mapToDouble(Float::doubleValue)
                            .average();

                    Float depAvg = avgOpt.isPresent() ? (float) avgOpt.getAsDouble() : null;

                    return new WorkerStatsResponse.DepartmentStatItem(dep, inDep.size(),
                            inDep.isEmpty() ? null : depAvg);
                })
                .sorted(Comparator.comparingLong(WorkerStatsResponse.DepartmentStatItem::getEmployees).reversed())
                .toList();

        return new WorkerStatsResponse(total, departments.size(), positions.size(),
                avgSalary, minSalary, maxSalary, earliestHire, latestHire, departmentStats);
    }

    @Transactional
    public WorkerResponse addWorker(WorkerRequest request) {
        checkEmailExists(request.getEmail());
        Worker worker = mapper.toWorker(request);
        if (request.getUserId() != null) bindUserToWorker(request.getUserId(), worker);
        Worker saved = workerRepository.save(worker);
        saveHistory(saved, "INSERT");
        return mapper.toResponse(saved);
    }

    @Transactional
    public WorkerResponse updateWorker(WorkerRequest request, Long id) {
        Worker worker = findWorkerById(id);
        saveHistory(worker, "UPDATE");
        if (request.getEmail() != null && !request.getEmail().isBlank()) checkEmailChange(request.getEmail(), id);
        mapper.updateEntity(request, worker);
        if (request.getUserId() != null) bindUserToWorker(request.getUserId(), worker);
        return mapper.toResponse(workerRepository.save(worker));
    }

    public WorkerResponse getWorkerById(Long id) {
        return mapper.toResponse(findWorkerById(id));
    }

    @Transactional
    public WorkerResponse createSelfWorker(String username, WorkerRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Пользователь " + username + " не найден"));

        if (user.getWorker() != null) return mapper.toResponse(user.getWorker());

        Optional<Worker> existing = workerRepository.findByEmail(user.getEmail());
        Worker worker = existing.orElseGet(() -> {
            Worker w = mapper.toWorker(request);
            w.setEmail(user.getEmail());
            return w;
        });

        if (worker.getUser() == null) {
            worker.setUser(user);
            user.setWorker(worker);
        }

        Worker saved = workerRepository.save(worker);
        userRepository.save(user);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void deleteWorker(Long id) {
        Worker worker = findWorkerById(id);
        saveHistory(worker, "DELETE");
        if (worker.getUser() != null) {
            User user = worker.getUser();
            user.setWorker(null);
            userRepository.save(user);
        }
        workerRepository.delete(worker);
    }

    @Transactional
    public String uploadAvatar(Long id, MultipartFile file) {
        validateFile(file);
        Worker worker = findWorkerById(id);
        saveHistory(worker, "UPDATE");

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadPath, filename);

        try {
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
        } catch (IOException e) {
            throw new FileUploadException("Ошибка загрузки файла", e);
        }

        worker.setAvatarUrl("/uploads/" + filename);
        workerRepository.save(worker);

        return worker.getAvatarUrl();
    }

    private void saveHistory(Worker worker, String action) {
        WorkerHistory history = WorkerHistory.builder()
                .workerId(worker.getId())
                .action(action)
                .changedAt(LocalDateTime.now())
                .name(worker.getName())
                .age(worker.getAge())
                .position(worker.getPosition())
                .email(worker.getEmail())
                .department(worker.getDepartment())
                .hireDate(worker.getHireDate())
                .salary(worker.getSalary())
                .avatarUrl(worker.getAvatarUrl())
                .build();

        var auth = SecurityContextHolder.getContext().getAuthentication();
        history.setChangedBy(auth != null ? auth.getName() : "SYSTEM");
        workerHistoryRepository.save(history);
    }

    private void checkEmailExists(String email) {
        workerRepository.findByEmail(email).ifPresent(w -> {
            throw new WorkerAlreadyExistsException("Работник с email " + email + " уже существует");
        });
    }

    private void checkEmailChange(String email, Long id) {
        workerRepository.findByEmail(email).filter(w -> !w.getId().equals(id)).ifPresent(w -> {
            throw new WorkerAlreadyExistsException("Работник с email " + email + " уже существует");
        });
    }

    private void bindUserToWorker(Long userId, Worker worker) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Пользователь с id " + userId + " не найден"));
        workerRepository.findByUser(user)
                .filter(w -> !w.getId().equals(worker.getId()))
                .ifPresent(w -> {
                    throw new WorkerAlreadyExistsException("Пользователь с id " + userId + " уже связан с другим работником");
                });
        worker.setUser(user);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw new FileUploadException("Файл не может быть пустым");
        if (file.getContentType() == null || !file.getContentType().startsWith("image/"))
            throw new FileUploadException("Файл должен быть изображением");
        if (file.getSize() > 5 * 1024 * 1024)
            throw new FileUploadException("Размер файла не должен превышать 5MB");
    }

    private Worker findWorkerById(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() -> new WorkerNotFoundException("Работник с id " + id + " не найден"));
    }
}
