package com.annoaja.backend.service;

import com.annoaja.backend.model.Story;
import com.annoaja.backend.repository.StoryRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final Cloudinary cloudinary;

    public StoryService(StoryRepository storyRepository, Cloudinary cloudinary) {
        this.storyRepository = storyRepository;
        this.cloudinary = cloudinary;
    }

    public Story createStory(
            MultipartFile file,
            String userId,
            String username,
            String userAvatar
    ) {
        try {
            String contentType = file.getContentType();
            String mediaType = contentType != null && contentType.startsWith("video")
                    ? "video"
                    : "image";

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "pingup-stories",
                            "resource_type", mediaType.equals("video") ? "video" : "image"
                    )
            );

            String mediaUrl = uploadResult.get("secure_url").toString();

            Instant now = Instant.now();

            Story story = new Story();
            story.setUserId(userId);
            story.setUsername(username);
            story.setUserAvatar(userAvatar);
            story.setMediaUrl(mediaUrl);
            story.setMediaType(mediaType);
            story.setCreatedAt(now);
            story.setExpiresAt(now.plus(24, ChronoUnit.HOURS));

            return storyRepository.save(story);

        } catch (Exception e) {
            throw new RuntimeException("Story upload failed: " + e.getMessage());
        }
    }

    public List<Story> getActiveStories() {
        return storyRepository.findByExpiresAtAfterOrderByCreatedAtDesc(Instant.now());
    }

    public void deleteStory(String storyId) {
        storyRepository.deleteById(storyId);
    }

    @Scheduled(fixedRate = 3600000)
    public void deleteExpiredStories() {
        storyRepository.deleteByExpiresAtBefore(Instant.now());
    }
}