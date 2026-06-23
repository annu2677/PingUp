package com.annoaja.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "stories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Story {

    @Id
    private String id;

    private String userId;
    private String username;
    private String userAvatar;

    private String mediaUrl;
    private String mediaType; // image or video

    private Instant createdAt;
    private Instant expiresAt;
}