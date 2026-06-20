package com.annoaja.backend.service;

import com.annoaja.backend.model.Like;
import com.annoaja.backend.repository.LikeRepository;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository){
        this.likeRepository = likeRepository;
    }

    public long toggleLike(String postId, String userId) {

        System.out.println("POST ID = " + postId);
        System.out.println("USER ID = " + userId);

        boolean alreadyLiked =
                likeRepository.existsByPostIdAndUserId(postId, userId);

        System.out.println("ALREADY LIKED = " + alreadyLiked);

        if(!alreadyLiked){

            Like like = new Like();

            like.setPostId(postId);
            like.setUserId(userId);

            Like saved = likeRepository.save(like);

            System.out.println("SAVED LIKE = " + saved);

        } else {

            System.out.println("REMOVING LIKE");

            Like existingLike =
                    likeRepository.findByPostIdAndUserId(postId,userId).orElse(null);

            if(existingLike != null){
                likeRepository.delete(existingLike);
            }
        }

        long count = likeRepository.countByPostId(postId);

        System.out.println("TOTAL LIKES = " + count);

        return count;
    }

    public long getLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }

    public boolean isPostLikedByUser(String postId, String userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }
 }
