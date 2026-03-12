package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.dto.LoginRequest;
import com.sprevn.dto.LoginResponse;
import com.sprevn.dto.SignupRequest;
import com.sprevn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다", null));
    }

    @GetMapping("/check-id")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkId(@RequestParam String id) {
        boolean exists = userService.checkIdDuplicate(id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("exists", exists)));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmail(@RequestParam String email) {
        boolean exists = userService.checkEmailDuplicate(email);
        return ResponseEntity.ok(ApiResponse.success(Map.of("exists", exists)));
    }
}
