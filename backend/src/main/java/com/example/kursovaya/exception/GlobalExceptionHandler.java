package com.example.kursovaya.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WorkerNotFoundException.class)
    public ResponseEntity<ExceptionDetails> handleWorkerNotFoundException(WorkerNotFoundException exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(WorkerAlreadyExistsException.class)
    public ResponseEntity<ExceptionDetails> handleWorkerAlreadyExistsException(WorkerAlreadyExistsException exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ExceptionDetails> handleUserAlreadyExistsException(UserAlreadyExistsException exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ExceptionDetails> handleUsernameNotFoundException(UsernameNotFoundException exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ExceptionDetails> handleUserNotFoundException(UserNotFoundException exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ExceptionDetails> handleFileUploadException(FileUploadException exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionDetails> handleGlobalException(Exception exception, WebRequest request) {
        ExceptionDetails details = new ExceptionDetails(new Date(), exception.getMessage(), request.getDescription(false));
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(details);
    }
}
