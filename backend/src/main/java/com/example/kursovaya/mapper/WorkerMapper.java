package com.example.kursovaya.mapper;

import com.example.kursovaya.dto.worker.WorkerRequest;
import com.example.kursovaya.dto.worker.WorkerResponse;
import com.example.kursovaya.model.Worker;
import org.springframework.stereotype.Component;

@Component
public class WorkerMapper {
    public WorkerResponse toResponse(Worker worker) {
        if (worker == null) return null;
        Long userId = worker.getUser() != null ? worker.getUser().getId() : null;
        return new WorkerResponse(worker.getId(), worker.getName(), worker.getAge(),
                worker.getPosition(), worker.getEmail(), worker.getDepartment(),
                worker.getHireDate(), worker.getSalary(), worker.getAvatarUrl(), userId);
    }

    public Worker toWorker(WorkerRequest dto) {
        if (dto == null) return null;

        return Worker.builder()
                .name(dto.getName())
                .age(dto.getAge())
                .position(dto.getPosition())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .hireDate(dto.getHireDate())
                .salary(dto.getSalary())
                .avatarUrl(dto.getAvatarURL())
                .build();
    }

    public void updateEntity(WorkerRequest dto, Worker worker) {
        if (dto.getName() != null) {
            worker.setName(dto.getName());
        }
        if (dto.getAge() != null) {
            worker.setAge(dto.getAge());
        }
        if (dto.getPosition() != null) {
            worker.setPosition(dto.getPosition());
        }
        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            worker.setEmail(dto.getEmail().trim());
        }
        if (dto.getDepartment() != null) {
            worker.setDepartment(dto.getDepartment());
        }
        if (dto.getHireDate() != null) {
            worker.setHireDate(dto.getHireDate());
        }
        if (dto.getSalary() != null) {
            worker.setSalary(dto.getSalary());
        }
        if (dto.getAvatarURL() != null) {
            worker.setAvatarUrl(dto.getAvatarURL());
        }
    }
}
