package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.dto.AdminUserUpdateRequest;
import com.sprevn.dto.SignupRequest;
import com.sprevn.entity.User;
import com.sprevn.service.EventService;
import com.sprevn.service.InquiryService;
import com.sprevn.service.ProjectService;
import com.sprevn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final EventService eventService;
    private final ProjectService projectService;
    private final InquiryService inquiryService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<User> users = userService.getAllUsers(page, size);
        // 비밀번호 제거
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "users", users,
                "total", userService.getTotalUserCount(),
                "page", page,
                "size", size)));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<Void>> createUser(
            @Valid @RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(ApiResponse.success("회원이 등록되었습니다", null));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserUpdateRequest request) {
        userService.updateUser(userId, request);
        return ResponseEntity.ok(ApiResponse.success("회원 정보가 수정되었습니다", null));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> body) {
        userService.updateUserStatus(userId, body.get("status"));
        return ResponseEntity.ok(ApiResponse.success("상태가 변경되었습니다", null));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("회원이 삭제되었습니다", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "totalUsers", userService.getTotalUserCount(),
                "totalEvents", eventService.getTotalCount(),
                "totalProjects", projectService.getTotalCount(),
                "unansweredInquiries", inquiryService.getUnansweredCount()
        )));
    }
}
