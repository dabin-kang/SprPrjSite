package com.sprevn.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSection {
    private Long sectionId;
    private Long projectId;
    private String title;
    private String content;
    private String sectionType;
    private Integer sortOrder;
    private LocalDateTime createdAt;

    @Builder.Default
    private List<ProjectImage> images = new ArrayList<>();
}
