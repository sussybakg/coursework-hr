package com.example.kursovaya.exception;

import java.io.IOException;

public class FileUploadException extends RuntimeException{
    public FileUploadException(String message){
        super(message);
    }
    public FileUploadException(String message, IOException cause){
        super(message, cause);
    }
}
