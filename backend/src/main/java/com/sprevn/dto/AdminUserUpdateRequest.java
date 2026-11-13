package com.sprevn.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminUserUpdateRequest {

    @Size(max = 100, message = "이름은 100자 이내로 입력해주세요")
    private String pname;

    @Email(message = "올바른 이메일 형식을 입력해주세요")
    @Size(max = 200, message = "이메일은 200자 이내로 입력해주세요")
    private String email;

    @Pattern(regexp = "^$|M|F", message = "성별 값은 M 또는 F여야 합니다")
    private String gender;

    @Pattern(regexp = "^$|\\d{2,3}-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식을 입력해주세요")
    private String phoneNumber;

    private String birthday;

    @Size(max = 500, message = "주소는 500자 이내로 입력해주세요")
    private String address;

    @Pattern(regexp = "^$|.{6,100}", message = "비밀번호는 6~100자여야 합니다")
    private String password;
}
