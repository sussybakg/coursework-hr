package com.example.kursovaya.service;

import com.example.kursovaya.exception.UserAlreadyExistsException;
import com.example.kursovaya.model.User;
import com.example.kursovaya.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;

    @Override
    @Transactional
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
    }

    @Transactional
    public User save(User user) {
        if (user.getWorker() != null && user.getWorker().getId() == null) {
            user.setWorker(null);
        }
        return repository.save(user);
    }

    @Transactional
    public User create(User user) {
        if (repository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Пользователь с email " + user.getEmail() + " уже существует");
        }

        if (repository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Пользователь с именем " + user.getUsername() + " уже существует");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setWorker(null);

        return save(user);
    }
}
