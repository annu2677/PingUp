package com.annoaja.backend.repository;

import com.annoaja.backend.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {

    boolean existsByPostIdAndUserId(String postId, String userId);

    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    long countByPostId(String postId);
}