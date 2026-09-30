package com.example.kursovaya.dto.worker;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Schema(description = "Запись истории изменений работника")
public class WorkerHistoryResponse {

    @Schema(description = "ID записи истории", example = "101")
    private Long id;

    @Schema(description = "Действие над сущностью (Создан, Обновлен, Удален)", example = "Обновлен")
    private String action;

    @Schema(description = "Тип сущности", example = "Работник")
    private String entity;

    @Schema(description = "Имя сущности", example = "Иван Иванов")
    private String entityName;

    @Schema(description = "Пользователь, совершивший действие", example = "admin")
    private String user;

    @Schema(description = "Временная метка изменения в формате ISO 8601", example = "2025-12-18T20:15:30Z")
    private String timestamp;

    @Schema(description = "ID работника, к которому относится запись истории", example = "15")
    private Long workerId;

    @Schema(description = "Возраст работника", example = "30")
    private Integer age;

    @Schema(description = "Должность работника", example = "Разработчик")
    private String position;

    @Schema(description = "Email работника", example = "ivan.ivanov@example.com")
    private String email;

    @Schema(description = "Отдел работника", example = "Разработка")
    private String department;

    @Schema(description = "Дата найма работника", example = "2020-01-15")
    private LocalDate hireDate;

    @Schema(description = "Зарплата работника", example = "2500.0")
    private Float salary;

    @Schema(description = "URL аватара работника", example = "/uploads/avatar_1234.png")
    private String avatarUrl;
}
