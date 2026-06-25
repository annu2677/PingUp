package com.annoaja.backend.service;

import com.annoaja.backend.model.Follow;
import com.annoaja.backend.repository.FollowRepository;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    private final FollowRepository followRepository;

    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    public boolean toggleFollow(String followerId, String followingId) {
        if (followerId == null || followingId == null) {
            throw new RuntimeException("User ids are required");
        }

        if (followerId.equals(followingId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        var existingFollow =
                followRepository.findByFollowerIdAndFollowingId(
                        followerId,
                        followingId
                );

        if (existingFollow.isPresent()) {
            followRepository.delete(existingFollow.get());
            return false;
        }

        Follow follow = new Follow(null, followerId, followingId);
        followRepository.save(follow);

        return true;
    }

    public long getFollowersCount(String userId) {
        return followRepository.countByFollowingId(userId);
    }

    public long getFollowingCount(String userId) {
        return followRepository.countByFollowerId(userId);
    }

    public boolean isFollowing(String followerId, String followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(
                followerId,
                followingId
        );
    }
}