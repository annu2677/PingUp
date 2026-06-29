package com.annoaja.backend.service;

import com.annoaja.backend.model.Notification;
import com.annoaja.backend.model.Post;
import com.annoaja.backend.model.User;
import com.annoaja.backend.repository.NotificationRepository;
import com.annoaja.backend.repository.PostRepository;
import com.annoaja.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository, PostRepository postRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public void createFollowNotification(String senderUserId, String recipientUserId) {
        if (senderUserId.equals(recipientUserId)) return;

        User sender = userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));

        Notification notification = new Notification();
        notification.setRecipientUserId(recipientUserId);
        notification.setSenderUserId(senderUserId);
        notification.setSenderUsername(sender.getUsername());
        notification.setSenderProfilePicture(sender.getProfilePicture());
        notification.setType("FOLLOW");
        notification.setMessage(sender.getUsername() + " started following you");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public void createLikeNotification(String senderUserId, String postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        String recipientUserId = post.getUserId();

        if (senderUserId.equals(recipientUserId)) return;

        User sender = userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));

        Notification notification = new Notification();
        notification.setRecipientUserId(recipientUserId);
        notification.setSenderUserId(senderUserId);
        notification.setSenderUsername(sender.getUsername());
        notification.setSenderProfilePicture(sender.getProfilePicture());
        notification.setType("LIKE");
        notification.setPostId(postId);
        notification.setMessage(sender.getUsername() + " liked your post");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public void createCommentNotification(String senderUserId, String postId, String commentId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        String recipientUserId = post.getUserId();

        if (senderUserId.equals(recipientUserId)) return;

        User sender = userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));

        Notification notification = new Notification();
        notification.setRecipientUserId(recipientUserId);
        notification.setSenderUserId(senderUserId);
        notification.setSenderUsername(sender.getUsername());
        notification.setSenderProfilePicture(sender.getProfilePicture());
        notification.setType("COMMENT");
        notification.setPostId(postId);
        notification.setCommentId(commentId);
        notification.setMessage(sender.getUsername() + " commented on your post");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}