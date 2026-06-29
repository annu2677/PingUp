package com.annoaja.backend.controller;

import com.annoaja.backend.model.Conversation;
import com.annoaja.backend.service.ConversationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/{userId}")
    public List<Conversation> getUserConversations(@PathVariable String userId) {
        return conversationService.getUserConversations(userId);
    }

    @GetMapping("/between/{userId1}/{userId2}")
    public Conversation getOrCreateConversation(@PathVariable String userId1, @PathVariable String userId2) {
        return conversationService.getOrCreateConversation(userId1, userId2);
    }
}