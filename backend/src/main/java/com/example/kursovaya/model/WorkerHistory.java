package com.example.kursovaya.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker_history")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkerHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "worker_history_id_seq")
    @SequenceGenerator(name = "worker_history_id_seq", sequenceName = "worker_history_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "worker_id", nullable = false)
    private Long workerId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "changed_by")
    private String changedBy;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    private String name;
    private Integer age;
    private String position;
    private String email;
    private String department;

    @Column(name = "hire_date")
    private java.time.LocalDate hireDate;

    private Float salary;

    @Column(name = "avatar_url")
    private String avatarUrl;
}

