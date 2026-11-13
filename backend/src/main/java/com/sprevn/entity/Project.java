
package com.sprevn.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    // 기본 프로젝트 정보
    private Long projectId;
    private String title;
    private String description;
    private String techStack;
    private String imageUrl;
    private String projectUrl;

    // 프로젝트 상태
    private Integer status;

    // 작성자 및 등록일
    private Long createdBy;
    private LocalDateTime createdAt;

    // CMS 추가 정보
    private String slug;
    private Integer projectNo;
    private String category;
    private LocalDateTime publishedAt;
    private Integer sortOrder;
    private List<ProjectSection> sections;
}
