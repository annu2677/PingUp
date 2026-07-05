package com.annoaja.backend.controller;

import com.annoaja.backend.model.Message;
import com.annoaja.backend.service.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatSocketController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(Map<String, String> body) {
        Message savedMessage = messageService.sendMessage(body.get("senderId"), body.get("receiverId"), body.get("text"));

        messagingTemplate.convertAndSend("/topic/conversation/" + savedMessage.getConversationId(), savedMessage);
    }

    @MessageMapping("/chat.typing")
    public void typing(Map<String, String> body) {
        String conversationId = body.get("conversationId");

        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId + "/typing", body);
    }

    @MessageMapping("/chat.read")
    public void markRead(Map<String, String> body) {
        String conversationId = body.get("conversationId");
        String receiverId = body.get("receiverId");

        messageService.markMessagesAsRead(conversationId, receiverId);

        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId + "/read", body);
    }

    @MessageMapping("/chat.status")
    public void userStatus(Map<String, String> body) {
        String userId = body.get("userId");
        String online = body.get("online");

        messagingTemplate.convertAndSend("/topic/user-status", body);
    }
}