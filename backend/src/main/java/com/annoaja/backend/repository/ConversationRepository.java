package com.annoaja.backend.repository;

import com.annoaja.backend.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByParticipantIdsContainingOrderByLastMessageAtDesc(String userId);
}