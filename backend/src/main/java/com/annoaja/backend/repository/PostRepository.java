package com.annoaja.backend.repository;

import com.annoaja.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post,String> {

}

