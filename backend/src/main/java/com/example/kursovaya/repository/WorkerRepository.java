package com.example.kursovaya.repository;

import com.example.kursovaya.model.User;
import com.example.kursovaya.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {

    Optional<Worker> findByEmail(String email);

    Optional<Worker> findByUser(User user);

}
