package com.sprevn.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    private Long projectId;
    private String title;
    private String description;
    private String techStack;
    private String imageUrl;
    private String projectUrl;
    private Integer status;
    private Long createdBy;
    private LocalDateTime createdAt;
}
