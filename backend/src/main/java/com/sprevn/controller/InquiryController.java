package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.entity.Inquiry;
import com.sprevn.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createInquiry(@RequestBody Inquiry inquiry) {
        inquiryService.createInquiry(inquiry);
        return ResponseEntity.ok(ApiResponse.success("문의가 접수되었습니다", null));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllInquiries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Inquiry> inquiries = inquiryService.getAllInquiries(page, size);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "inquiries", inquiries,
                "total", inquiryService.getTotalCount(),
                "page", page,
                "size", size)));
    }

    @GetMapping("/{inquiryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Inquiry>> getInquiry(@PathVariable Long inquiryId) {
        return ResponseEntity.ok(ApiResponse.success(inquiryService.getInquiry(inquiryId)));
    }

    @PostMapping("/{inquiryId}/answer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> answerInquiry(
            @PathVariable Long inquiryId,
            @RequestBody Map<String, String> body) {
        inquiryService.answerInquiry(inquiryId, body.get("answer"));
        return ResponseEntity.ok(ApiResponse.success("답변이 등록되었습니다", null));
    }

    @DeleteMapping("/{inquiryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteInquiry(@PathVariable Long inquiryId) {
        inquiryService.deleteInquiry(inquiryId);
        return ResponseEntity.ok(ApiResponse.success("문의가 삭제되었습니다", null));
    }
}
