package com.example.kursovaya.exception;

public class WorkerAlreadyExistsException extends RuntimeException {
    public WorkerAlreadyExistsException(String message) {
        super(message);
    }
}
