package com.annoaja.backend.controller;

import com.annoaja.backend.dto.AuthResponse;
import com.annoaja.backend.model.User;
import com.annoaja.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            AuthResponse response = userService.registerUser(user);
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        }
    }

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
//    //public AuthResponse register(@RequestBody User user) {
//        //return userService.registerUser(user);
//        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered"));
//    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody User user) {
        return userService.loginUser(user.getEmail(), user.getPassword());
    }
}