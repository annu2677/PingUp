package com.annoaja.backend.controller;

import com.annoaja.backend.model.Post;
import com.annoaja.backend.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins="*")

public class PostController {

    private final PostService service;

    public PostController(PostService service){
        this.service=service;
    }

    @PostMapping
    public Post createPost(@RequestBody Post post){
        return service.createPost(post);
    }

    @GetMapping
    public List<Post> getPosts(){
        return service.getAllPosts();
    }
}


