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
public class User {
    private Long userId;
    private String id;
    private String pname;
    private String email;
    private String gender;
    private String phoneNumber;
    private LocalDate birthday;
    private String address;
    private String password;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime coming;
}
