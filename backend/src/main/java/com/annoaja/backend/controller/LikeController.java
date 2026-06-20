package com.annoaja.backend.controller;

import com.annoaja.backend.service.LikeService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*")
public class LikeController {
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{postId}")
    public long toggleLike(
            @PathVariable String postId,
            @RequestBody Map<String, String> body
    ) {
        String userId = body.get("userId");
        return likeService.toggleLike(postId, userId);
    }

    @GetMapping("/{postId}/count")
    public long getLikeCount(@PathVariable String postId) {
        return likeService.getLikeCount(postId);
    }

    @GetMapping("/{postId}/liked/{userId}")
    public boolean isPostLikedByUser(
            @PathVariable String postId,
            @PathVariable String userId
    ) {
        return likeService.isPostLikedByUser(postId, userId);
    }
}
