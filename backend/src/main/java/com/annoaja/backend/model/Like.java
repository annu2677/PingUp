package com.annoaja.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

@Document(collection = "likes")
@CompoundIndex(
        name = "post_user_unique",
        def = "{'postId':1,'userId':1}",
        unique = true
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {

    @Id
    private String id;
    private String postId;
    private String userId;
}
