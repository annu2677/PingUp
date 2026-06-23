package com.annoaja.backend.repository;

import com.annoaja.backend.model.Story;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface StoryRepository extends MongoRepository<Story, String> {

    List<Story> findByExpiresAtAfterOrderByCreatedAtDesc(Instant now);

    void deleteByExpiresAtBefore(Instant now);
}