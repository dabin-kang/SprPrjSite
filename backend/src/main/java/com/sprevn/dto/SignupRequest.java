package com.sprevn.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank(message = "아이디를 입력해주세요")
    @Size(min = 4, max = 50, message = "아이디는 4~50자 이내로 입력해주세요")
    private String id;

    @NotBlank(message = "이름을 입력해주세요")
    private String pname;

    @NotBlank(message = "이메일을 입력해주세요")
    @Email(message = "올바른 이메일 형식을 입력해주세요")
    private String email;

    private String gender;

    @Pattern(regexp = "^\\d{2,3}-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식을 입력해주세요")
    private String phoneNumber;

    private String birthday;

    private String address;

    @NotBlank(message = "비밀번호를 입력해주세요")
    @Size(min = 6, max = 100, message = "비밀번호는 6자 이상이어야 합니다")
    private String password;
}
