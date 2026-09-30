package com.example.kursovaya.security;

import com.example.kursovaya.dto.auth.JwtAuthenticationResponse;
import com.example.kursovaya.dto.auth.SignInRequest;
import com.example.kursovaya.dto.auth.SignUpRequest;
import com.example.kursovaya.model.Role;
import com.example.kursovaya.model.User;
import com.example.kursovaya.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public JwtAuthenticationResponse signUp(SignUpRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .worker(null)
                .build();

        User savedUser = userService.create(user);
        var jwtToken = jwtService.generateToken(savedUser);

        return new JwtAuthenticationResponse(jwtToken);
    }

    public JwtAuthenticationResponse signIn(SignInRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
        ));

        var user = userService
                .loadUserByUsername(request.getUsername());

        var jwtToken = jwtService.generateToken(user);
        return new JwtAuthenticationResponse(jwtToken);
    }
}
