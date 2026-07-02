package com.annoaja.backend.controller;

import com.annoaja.backend.model.Message;
import com.annoaja.backend.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public Message sendMessage(@RequestBody Map<String, String> body) {
        return messageService.sendMessage(body.get("senderId"), body.get("receiverId"), body.get("text"));
    }

    @GetMapping("/{conversationId}")
    public List<Message> getMessages(@PathVariable String conversationId) {
        return messageService.getMessages(conversationId);
    }

    @PutMapping("/{conversationId}/read/{receiverId}")
    public void markMessagesAsRead(@PathVariable String conversationId, @PathVariable String receiverId) {
        messageService.markMessagesAsRead(conversationId, receiverId);
    }
}