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
public class ProjectImage {
    private Long imageId;
    private Long projectId;
    private Long sectionId;
    private String imageUrl;
    private String imageAlt;
    private String imageType;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
