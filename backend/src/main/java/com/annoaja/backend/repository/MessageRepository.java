package com.annoaja.backend.repository;

import com.annoaja.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    List<Message> findByConversationIdAndReceiverIdAndReadFalse(String conversationId, String receiverId);

    long countByConversationIdAndReceiverIdAndReadFalse(String conversationId, String receiverId);
}