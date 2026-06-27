package com.annoaja.backend.service;

import com.annoaja.backend.model.Comment;
import com.annoaja.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    public CommentService(
            CommentRepository commentRepository,
            NotificationService notificationService
    ) {
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
    }

    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        notificationService.createCommentNotification(comment.getUserId(), comment.getPostId());

        return savedComment;
    }

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public long getCommentCount(String postId) {
        return commentRepository.countByPostId(postId);
    }
}