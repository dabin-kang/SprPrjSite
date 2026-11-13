package com.sprevn.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventUpdateRequest {
    private String title;
    private String content;
    private String imageUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer status;
    private Boolean clearImageUrl;
    private Boolean clearStartDate;
    private Boolean clearEndDate;
}
