package com.sprevn.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Lantern {
    private Long id;
    private String name;
    private String wish;
    private LocalDateTime createdAt;
}
