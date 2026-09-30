package com.example.kursovaya.dto.worker;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;

@Data
@Schema(description = "Запрос для создания или обновления работника")
public class WorkerRequest {
    @Schema(description = "Имя работника", example = "Иван Иванов")
    private String name;

    @Schema(description = "Возраст работника", example = "30")
    private Integer age;

    @Schema(description = "Должность", example = "Разработчик")
    private String position;

    @Schema(description = "Email адрес", example = "ivan@example.com")
    private String email;

    @Schema(description = "Отдел", example = "IT")
    private String department;

    @Schema(description = "Дата найма", example = "2024-01-15")
    private LocalDate hireDate;

    @Schema(description = "Зарплата", example = "75000.0")
    private Float salary;

    @Schema(description = "URL аватара", example = "https://example.com/avatar.jpg")
    private String avatarURL;

    @Schema(description = "ID пользователя для связи (опционально)", example = "1")
    private Long userId;
}
