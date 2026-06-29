package com.annoaja.backend.repository;

import com.annoaja.backend.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByParticipantIdsContainingOrderByLastMessageAtDesc(String userId);

    Optional<Conversation> findByParticipantIdsContainingAndParticipantIdsContaining(String userId1, String userId2);
}