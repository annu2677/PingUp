package com.annoaja.backend.service;

import com.annoaja.backend.model.Conversation;
import com.annoaja.backend.repository.ConversationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;

    public ConversationService(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    public Conversation getOrCreateConversation(String userId1, String userId2) {
        List<Conversation> userConversations = conversationRepository.findByParticipantIdsContainingOrderByLastMessageAtDesc(userId1);

        for (Conversation conversation : userConversations) {
            if (conversation.getParticipantIds() != null && conversation.getParticipantIds().contains(userId2)) {
                return conversation;
            }
        }

        Conversation conversation = new Conversation();
        conversation.setParticipantIds(Arrays.asList(userId1, userId2));
        conversation.setLastMessage("");
        conversation.setLastMessageSenderId("");
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setLastMessageAt(LocalDateTime.now());

        return conversationRepository.save(conversation);
    }

    public List<Conversation> getUserConversations(String userId) {
        return conversationRepository.findByParticipantIdsContainingOrderByLastMessageAtDesc(userId);
    }

    public Conversation updateLastMessage(String conversationId, String text, String senderId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new RuntimeException("Conversation not found"));

        conversation.setLastMessage(text);
        conversation.setLastMessageSenderId(senderId);
        conversation.setLastMessageAt(LocalDateTime.now());

        return conversationRepository.save(conversation);
    }
}