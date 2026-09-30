package com.example.kursovaya.controller;

import com.example.kursovaya.dto.auth.JwtAuthenticationResponse;
import com.example.kursovaya.dto.auth.SignInRequest;
import com.example.kursovaya.dto.auth.SignUpRequest;
import com.example.kursovaya.security.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Аутентификация", description = "API для регистрации и входа в систему")
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping("/sign-up")
    @Operation(summary = "Регистрация пользователя", description = "Создает нового пользователя и возвращает JWT токен")
    public JwtAuthenticationResponse signUp(@RequestBody @Valid SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @PostMapping("/sign-in")
    @Operation(summary = "Вход в систему", description = "Аутентифицирует пользователя и возвращает JWT токен")
    public JwtAuthenticationResponse signIn(@RequestBody @Valid SignInRequest request) {
        return authenticationService.signIn(request);
    }
}
