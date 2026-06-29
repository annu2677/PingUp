package com.annoaja.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    private String id;

    private String recipientUserId;
    private String senderUserId;
    private String senderUsername;
    private String senderProfilePicture;

    private String type; // FOLLOW, LIKE, COMMENT

    private String postId;
    private String commentId;

    private String message;

    private boolean read;

    private LocalDateTime createdAt;
}