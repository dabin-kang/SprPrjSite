package com.sprevn.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InquiryAnswerRequest {

    @NotBlank(message = "답변 내용을 입력해주세요")
    @Size(max = 10000, message = "답변은 10000자 이내로 입력해주세요")
    private String answer;
}
