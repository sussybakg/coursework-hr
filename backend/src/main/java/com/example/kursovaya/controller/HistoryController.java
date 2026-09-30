package com.example.kursovaya.controller;

import com.example.kursovaya.dto.worker.WorkerHistoryResponse;
import com.example.kursovaya.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workers")
@RequiredArgsConstructor
@Tag(name = "Работники", description = "API для управления работниками")
public class HistoryController {
    private final HistoryService historyService;

    @Operation(summary = "Получить историю изменений всех работников.", description = "Позволяет получить историю изменения всех работника. Доступно для роли ADMIN.")
    @GetMapping("/history")
    public List<WorkerHistoryResponse> getHistory() {
        return historyService.getAllHistory();
    }

    @Operation(summary = "Получить историю изменений работника.", description = "Позволяет получить историю изменения данного работника. Доступно для роли ADMIN.")
    @GetMapping("/{id}/history")
    public List<WorkerHistoryResponse> getWorkerHistory(@PathVariable Long id) {
        return historyService.getWorkerHistory(id);
    }
}
