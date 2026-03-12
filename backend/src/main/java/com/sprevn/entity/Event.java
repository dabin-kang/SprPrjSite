package com.sprevn.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    private Long eventId;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer status;
    private Long createdBy;
    private LocalDateTime createdAt;
}
