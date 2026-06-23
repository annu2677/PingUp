package com.annoaja.backend.service;

import com.annoaja.backend.model.Story;
import com.annoaja.backend.repository.StoryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class StoryService {

    private final StoryRepository storyRepository;

    public StoryService(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    public Story createStory(Story story) {
        Instant now = Instant.now();

        story.setCreatedAt(now);
        story.setExpiresAt(now.plus(24, ChronoUnit.HOURS));

        return storyRepository.save(story);
    }

    public List<Story> getActiveStories() {
        return storyRepository.findByExpiresAtAfterOrderByCreatedAtDesc(Instant.now());
    }

    public List<Story> getActiveStoriesByUser(String userId) {
        return storyRepository.findByUserIdAndExpiresAtAfterOrderByCreatedAtDesc(userId, Instant.now());
    }

    public void deleteStory(String storyId) {
        storyRepository.deleteById(storyId);
    }

    @Scheduled(fixedRate = 3600000)
    public void deleteExpiredStories() {
        storyRepository.deleteByExpiresAtBefore(Instant.now());
    }
}