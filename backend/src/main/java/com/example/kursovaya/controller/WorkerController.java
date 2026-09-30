package com.example.kursovaya.controller;

import com.example.kursovaya.dto.worker.WorkerRequest;
import com.example.kursovaya.dto.worker.WorkerResponse;
import com.example.kursovaya.dto.worker.WorkerStatsResponse;
import com.example.kursovaya.service.WorkerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workers")
@RequiredArgsConstructor
@Tag(name = "Работники", description = "API для управления работниками")
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public List<WorkerResponse> getWorkers() {
        return workerService.getWorkers();
    }

    @GetMapping("/stats")
    public WorkerStatsResponse getStats() {
        return workerService.getStats();
    }

    @PostMapping
    public WorkerResponse addWorker(@RequestBody @Valid WorkerRequest request) {
        return workerService.addWorker(request);
    }

    @PutMapping("/{id}")
    public WorkerResponse updateWorker(
            @PathVariable Long id,
            @RequestBody @Valid WorkerRequest request) {
        return workerService.updateWorker(request, id);
    }

    @DeleteMapping("/{id}")
    public void deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
    }

    @GetMapping("/{id}")
    public WorkerResponse getWorkerById(@PathVariable Long id) {
        return workerService.getWorkerById(id);
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<String> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(workerService.uploadAvatar(id, file));
    }

    @PostMapping("/self")
    public ResponseEntity<WorkerResponse> createSelfWorker(
            Authentication authentication,
            @RequestBody @Valid WorkerRequest request) {

        WorkerResponse response =
                workerService.createSelfWorker(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
