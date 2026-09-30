package com.example.kursovaya.service;

import com.example.kursovaya.dto.worker.WorkerHistoryResponse;
import com.example.kursovaya.mapper.WorkerHistoryMapper;
import com.example.kursovaya.model.WorkerHistory;
import com.example.kursovaya.repository.WorkerHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final WorkerHistoryRepository workerHistoryRepository;
    private final WorkerHistoryMapper mapper;

    public List<WorkerHistoryResponse> getWorkerHistory(Long workerId) {
        List<WorkerHistory> history = workerHistoryRepository.findByWorkerIdOrderByChangedAtDesc(workerId);
        return mapper.mapToDto(history);
    }

    public List<WorkerHistoryResponse> getAllHistory() {
        List<WorkerHistory> history = workerHistoryRepository.findAllByOrderByChangedAtDesc();
        return mapper.mapToDto(history);
    }

}
