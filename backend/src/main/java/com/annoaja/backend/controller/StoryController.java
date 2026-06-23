package com.annoaja.backend.controller;

import com.annoaja.backend.model.Story;
import com.annoaja.backend.service.StoryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public Story createStory(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId,
            @RequestParam("username") String username,
            @RequestParam(value = "userAvatar", required = false) String userAvatar
    ) {
        return storyService.createStory(file, userId, username, userAvatar);
    }

    @GetMapping
    public List<Story> getActiveStories() {
        return storyService.getActiveStories();
    }

    @DeleteMapping("/{storyId}")
    public void deleteStory(@PathVariable String storyId) {
        storyService.deleteStory(storyId);
    }
}