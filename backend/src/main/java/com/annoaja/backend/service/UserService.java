package com.annoaja.backend.service;

import com.annoaja.backend.dto.AuthResponse;
import com.annoaja.backend.model.User;
import com.annoaja.backend.repository.UserRepository;
import com.annoaja.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registerUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail());

        return new AuthResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getProfilePicture(), token);
    }

    public AuthResponse loginUser(String email, String password) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), user.getProfilePicture(), token);
    }

    public User getUserById(String id) {

        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(null);

        return user;
    }
}