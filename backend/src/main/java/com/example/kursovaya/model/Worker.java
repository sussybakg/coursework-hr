package com.example.kursovaya.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.NaturalId;

import java.time.LocalDate;

@Entity
@Table(name = "worker")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "worker_id_seq")
    @SequenceGenerator(name = "worker_id_seq", sequenceName = "worker_id_seq", allocationSize = 1)
    private Long id;
    private String name;
    private Integer age;
    private String position;

    @NaturalId(mutable = true)
    @Column(nullable = false)
    private String email;
    private String department;
    @Column(name = "hire_date")
    private LocalDate hireDate;
    private Float salary;
    @Column(name = "avatar_url")
    private String avatarUrl;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "user_id", unique = true, nullable = true)
    private User user;
}
