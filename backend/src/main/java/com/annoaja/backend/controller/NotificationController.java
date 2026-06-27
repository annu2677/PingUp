package com.annoaja.backend.controller;

import com.annoaja.backend.model.Notification;
import com.annoaja.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable String userId) {
        return notificationService.getNotifications(userId);
    }

    @GetMapping("/{userId}/unread-count")
    public long getUnreadCount(@PathVariable String userId) {
        return notificationService.getUnreadCount(userId);
    }

    @PutMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
    }
}