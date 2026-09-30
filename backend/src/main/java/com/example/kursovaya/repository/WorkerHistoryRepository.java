package com.example.kursovaya.repository;

import com.example.kursovaya.model.WorkerHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerHistoryRepository extends JpaRepository<WorkerHistory, Long> {
    List<WorkerHistory> findByWorkerIdOrderByChangedAtDesc(Long workerId);

    List<WorkerHistory> findAllByOrderByChangedAtDesc();
}

