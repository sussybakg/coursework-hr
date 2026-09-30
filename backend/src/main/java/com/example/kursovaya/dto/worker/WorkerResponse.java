package com.example.kursovaya.dto.worker;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@Schema(description = "Ответ с информацией о работнике")
public class WorkerResponse {
    @Schema(description = "Идентификатор работника", example = "1")
    public Long id;

    @Schema(description = "Имя работника", example = "Иван Иванов")
    public String name;

    @Schema(description = "Возраст работника", example = "30")
    public Integer age;

    @Schema(description = "Должность", example = "Разработчик")
    public String position;

    @Schema(description = "Email адрес", example = "ivan@example.com")
    public String email;

    @Schema(description = "Отдел", example = "IT")
    public String department;

    @Schema(description = "Дата найма", example = "2024-01-15")
    public LocalDate hireDate;

    @Schema(description = "Зарплата", example = "75000.0")
    public Float salary;

    @Schema(description = "URL аватара", example = "https://example.com/avatar.jpg")
    public String avatarURL;

    @Schema(description = "ID связанного пользователя", example = "1")
    public Long userId;
}
