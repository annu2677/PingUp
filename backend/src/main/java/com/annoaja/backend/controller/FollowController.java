package com.annoaja.backend.controller;

import com.annoaja.backend.service.FollowService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/follows")
@CrossOrigin(origins = "*")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public Map<String, Object> toggleFollow(@RequestBody Map<String, String> body) {
        String followerId = body.get("followerId");
        String followingId = body.get("followingId");

        boolean following = followService.toggleFollow(followerId, followingId);

        return Map.of("following", following);
    }

    @GetMapping("/{userId}/followers/count")
    public Map<String, Long> getFollowersCount(@PathVariable String userId) {
        return Map.of("count", followService.getFollowersCount(userId));
    }

    @GetMapping("/{userId}/following/count")
    public Map<String, Long> getFollowingCount(@PathVariable String userId) {
        return Map.of("count", followService.getFollowingCount(userId));
    }

    @GetMapping("/status")
    public Map<String, Boolean> isFollowing(
            @RequestParam String followerId,
            @RequestParam String followingId
    ) {
        return Map.of(
                "following",
                followService.isFollowing(followerId, followingId)
        );
    }
}