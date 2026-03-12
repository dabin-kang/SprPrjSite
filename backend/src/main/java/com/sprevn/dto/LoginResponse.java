package com.sprevn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String tokenType;
    private Long userId;
    private String id;
    private String pname;
    private String email;
    private Integer status;

    public static LoginResponse of(String token, com.sprevn.entity.User user) {
        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getUserId())
                .id(user.getId())
                .pname(user.getPname())
                .email(user.getEmail())
                .status(user.getStatus())
                .build();
    }
}
