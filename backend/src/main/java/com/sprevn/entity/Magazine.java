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
public class Magazine {
    private Long magazineId;
    private String title;
    private String content;
    private String category;
    private String thumbnail;
    private Integer viewCount;
    private Integer status;
    private Long createdBy;
    private LocalDateTime createdAt;
}
