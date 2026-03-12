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
public class Inquiry {
    private Long inquiryId;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String category;
    private String title;
    private String content;
    private String answer;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
}
