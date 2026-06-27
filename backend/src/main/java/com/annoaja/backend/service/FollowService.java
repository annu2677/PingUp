package com.annoaja.backend.service;

import com.annoaja.backend.model.Follow;
import com.annoaja.backend.repository.FollowRepository;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    public FollowService(FollowRepository followRepository, NotificationService notificationService) {
        this.followRepository = followRepository;
        this.notificationService = notificationService;
    }

    public boolean toggleFollow(String followerId, String followingId) {
        if (followerId == null || followingId == null) {
            throw new RuntimeException("User ids are required");
        }

        if (followerId.equals(followingId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        var existingFollow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);

        if (existingFollow.isPresent()) {
            followRepository.delete(existingFollow.get());
            return false;
        }

        Follow follow = new Follow(null, followerId, followingId);
        followRepository.save(follow);

        notificationService.createFollowNotification(followerId, followingId);

        return true;
    }

    public long getFollowersCount(String userId) {
        return followRepository.countByFollowingId(userId);
    }

    public long getFollowingCount(String userId) {
        return followRepository.countByFollowerId(userId);
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
}