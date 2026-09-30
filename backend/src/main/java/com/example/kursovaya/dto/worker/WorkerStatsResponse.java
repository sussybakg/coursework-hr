package com.example.kursovaya.dto.worker;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@Schema(description = "Статистика по работникам")
public class WorkerStatsResponse {

    @Schema(description = "Общее количество работников", example = "150")
    private long totalWorkers;

    @Schema(description = "Количество уникальных отделов", example = "5")
    private long uniqueDepartments;

    @Schema(description = "Количество уникальных должностей", example = "10")
    private long uniquePositions;

    @Schema(description = "Средняя зарплата работников", example = "2500.50")
    private Float averageSalary;

    @Schema(description = "Минимальная зарплата", example = "1200.0")
    private Float minSalary;

    @Schema(description = "Максимальная зарплата", example = "5000.0")
    private Float maxSalary;

    @Schema(description = "Дата наименьшего найма работника", example = "2020-01-15")
    private LocalDate earliestHireDate;

    @Schema(description = "Дата последнего найма работника", example = "2025-06-01")
    private LocalDate latestHireDate;

    @Schema(description = "Статистика по каждому отделу")
    private List<DepartmentStatItem> departmentStats;

    @Data
    @AllArgsConstructor
    @Schema(description = "Статистика по отдельному отделу")
    public static class DepartmentStatItem {

        @Schema(description = "Название отдела", example = "Разработка")
        private String department;

        @Schema(description = "Количество сотрудников в отделе", example = "30")
        private long employees;

        @Schema(description = "Средняя зарплата сотрудников отдела", example = "2700.0")
        private Float averageSalary;
    }
}
