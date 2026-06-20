package com.annoaja.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AuthResponse {

    private String id;
    private String username;
    private String email;
    private String profilePicture;
    private String token;
}
