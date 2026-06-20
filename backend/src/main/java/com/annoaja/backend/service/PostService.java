package com.annoaja.backend.service;

import com.annoaja.backend.model.Post;
import com.annoaja.backend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDateTime;

@Service

public class PostService {

    private final PostRepository repo;

    public PostService(PostRepository repo){
        this.repo=repo;
    }

    public Post createPost(Post post){
        post.setCreatedAt(LocalDateTime.now());
        return repo.save(post);
    }

    public List<Post> getAllPosts(){
        return repo.findAll();
    }
}

