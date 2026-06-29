package com.annoaja.backend.service;

import com.annoaja.backend.model.Conversation;
import com.annoaja.backend.model.Message;
import com.annoaja.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationService conversationService;

    public MessageService(MessageRepository messageRepository, ConversationService conversationService) {
        this.messageRepository = messageRepository;
        this.conversationService = conversationService;
    }

    public Message sendMessage(String senderId, String receiverId, String text) {
        Conversation conversation = conversationService.getOrCreateConversation(senderId, receiverId);

        Message message = new Message();
        message.setConversationId(conversation.getId());
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setText(text);
        message.setRead(false);
        message.setCreatedAt(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        conversationService.updateLastMessage(conversation.getId(), text, senderId);

        return savedMessage;
    }

    public List<Message> getMessages(String conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}