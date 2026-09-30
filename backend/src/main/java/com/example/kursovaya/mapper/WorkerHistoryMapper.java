package com.example.kursovaya.mapper;

import com.example.kursovaya.dto.worker.WorkerHistoryResponse;
import com.example.kursovaya.model.WorkerHistory;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.List;

@Component
public class WorkerHistoryMapper {
    public List<WorkerHistoryResponse> mapToDto(List<WorkerHistory> history) {
        return history.stream().map(h -> {
            String action = translateAction(h.getAction());
            String entityName = h.getName() != null ? h.getName() : "Неизвестно";
            String user = h.getChangedBy() != null ? h.getChangedBy() : "NONE";
            String timestamp = h.getChangedAt()
                    .atZone(ZoneId.systemDefault())
                    .toInstant()
                    .toString();

            return new WorkerHistoryResponse(
                    h.getId(),
                    action,
                    "Работник",
                    entityName,
                    user,
                    timestamp,
                    h.getWorkerId(),
                    h.getAge(),
                    h.getPosition(),
                    h.getEmail(),
                    h.getDepartment(),
                    h.getHireDate(),
                    h.getSalary(),
                    h.getAvatarUrl()
            );
        }).toList();
    }

    private String translateAction(String action) {
        return switch (action) {
            case "INSERT" -> "Создан";
            case "UPDATE" -> "Обновлен";
            case "DELETE" -> "Удален";
            default -> action;
        };
    }
}
