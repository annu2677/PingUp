package com.annoaja.backend.repository;

import com.annoaja.backend.model.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FollowRepository extends MongoRepository<Follow, String> {

    Optional<Follow> findByFollowerIdAndFollowingId(String followerId, String followingId);

    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);

    long countByFollowingId(String followingId);

    long countByFollowerId(String followerId);
}