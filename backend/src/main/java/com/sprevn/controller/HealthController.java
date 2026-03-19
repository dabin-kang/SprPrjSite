package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
public class HealthController {

    private final UserMapper userMapper;

    @Value("${spring.datasource.url:미설정}")
    private String datasourceUrl;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> result = new LinkedHashMap<>();

        // 1. 서버 상태
        result.put("server", "✅ 정상");
        result.put("timestamp", LocalDateTime.now().toString());

        // 2. DB 연결 확인
        String dbStatus;
        int userCount = 0;
        try {
            userCount = userMapper.countAll();
            dbStatus = "✅ 정상";
        } catch (Exception e) {
            dbStatus = "❌ 연결 실패: " + e.getMessage();
            log.error("DB 연결 실패", e);
        }
        result.put("database", dbStatus);
        result.put("totalUsers", userCount);

        // 3. 환경변수 확인 (값 마스킹)
        String maskedUrl = datasourceUrl.contains("@")
                ? datasourceUrl.replaceAll(":[^@]+@", ":****@")
                : (datasourceUrl.length() > 30 ? datasourceUrl.substring(0, 30) + "..." : datasourceUrl);
        result.put("dbUrl", maskedUrl);

        boolean allOk = dbStatus.startsWith("✅");
        result.put("status", allOk ? "✅ 전체 정상" : "❌ 일부 오류");

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
