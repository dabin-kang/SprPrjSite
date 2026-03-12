package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.entity.Magazine;
import com.sprevn.service.MagazineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/magazines")
@RequiredArgsConstructor
public class MagazineController {

    private final MagazineService magazineService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMagazines(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        List<Magazine> magazines;
        if (category != null && !category.isBlank()) {
            magazines = magazineService.getMagazinesByCategory(category, page, size);
        } else {
            magazines = magazineService.getAllMagazines(page, size);
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "magazines", magazines,
                "total", magazineService.getTotalCount(),
                "page", page,
                "size", size)));
    }

    @GetMapping("/{magazineId}")
    public ResponseEntity<ApiResponse<Magazine>> getMagazine(@PathVariable Long magazineId) {
        return ResponseEntity.ok(ApiResponse.success(magazineService.getMagazine(magazineId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> createMagazine(@RequestBody Magazine magazine) {
        magazineService.createMagazine(magazine);
        return ResponseEntity.ok(ApiResponse.success("매거진이 등록되었습니다", null));
    }

    @PutMapping("/{magazineId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateMagazine(@PathVariable Long magazineId, @RequestBody Magazine magazine) {
        magazine.setMagazineId(magazineId);
        magazineService.updateMagazine(magazine);
        return ResponseEntity.ok(ApiResponse.success("매거진이 수정되었습니다", null));
    }

    @DeleteMapping("/{magazineId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMagazine(@PathVariable Long magazineId) {
        magazineService.deleteMagazine(magazineId);
        return ResponseEntity.ok(ApiResponse.success("매거진이 삭제되었습니다", null));
    }
}
