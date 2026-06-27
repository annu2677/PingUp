package com.annoaja.backend.service;

import com.annoaja.backend.model.Like;
import com.annoaja.backend.repository.LikeRepository;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final NotificationService notificationService;

    public LikeService(LikeRepository likeRepository, NotificationService notificationService) {
        this.likeRepository = likeRepository;
        this.notificationService = notificationService;
    }

    public long toggleLike(String postId, String userId) {

        boolean alreadyLiked = likeRepository.existsByPostIdAndUserId(postId, userId);

        if (!alreadyLiked) {

            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(userId);

            likeRepository.save(like);

            notificationService.createLikeNotification(userId, postId);

        }
        else {

            Like existingLike = likeRepository.findByPostIdAndUserId(postId, userId).orElse(null);

            if (existingLike != null) {
                likeRepository.delete(existingLike);
            }
        }

        return likeRepository.countByPostId(postId);
    }

    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    public boolean isPostLikedByUser(String postId, String userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }
}