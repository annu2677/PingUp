package com.annoaja.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    private String id;

    private List<String> participantIds;

    private String lastMessage;
    private String lastMessageSenderId;

    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt;
}