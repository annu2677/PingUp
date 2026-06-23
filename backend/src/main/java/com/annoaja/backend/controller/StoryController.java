package com.annoaja.backend.controller;

import com.annoaja.backend.model.Story;
import com.annoaja.backend.service.StoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @PostMapping
    public Story createStory(@RequestBody Story story) {
        return storyService.createStory(story);
    }

    @GetMapping
    public List<Story> getActiveStories() {
        return storyService.getActiveStories();
    }

    @GetMapping("/user/{userId}")
    public List<Story> getActiveStoriesByUser(@PathVariable String userId) {
        return storyService.getActiveStoriesByUser(userId);
    }

    @DeleteMapping("/{storyId}")
    public void deleteStory(@PathVariable String storyId) {
        storyService.deleteStory(storyId);
    }
}