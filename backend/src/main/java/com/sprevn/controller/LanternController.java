package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.entity.Lantern;
import com.sprevn.service.LanternService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lanterns")
@RequiredArgsConstructor
public class LanternController {

    private final LanternService lanternService;


    /*
     * 전체 연등 조회
     *
     * GET /api/lanterns
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Lantern>>> getAllLanterns() {

        return ResponseEntity.ok(
            ApiResponse.success(
                lanternService.getAllLanterns()
            )
        );
    }


    /*
     * 연등 하나 조회
     *
     * GET /api/lanterns/{lanternId}
     */
    @GetMapping("/{lanternId}")
    public ResponseEntity<ApiResponse<Lantern>> getLantern(
            @PathVariable Long lanternId
    ) {

        return ResponseEntity.ok(
            ApiResponse.success(
                lanternService.getLantern(lanternId)
            )
        );
    }


    /*
     * 연등 생성
     *
     * POST /api/lanterns
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Lantern>> createLantern(
            @RequestBody Lantern lantern
    ) {

        Lantern created =
            lanternService.createLantern(lantern);

        return ResponseEntity.ok(
            ApiResponse.success(
                "연등이 성공적으로 달렸습니다.",
                created
            )
        );
    }


    /*
     * 관리자용 삭제
     *
     * DELETE /api/lanterns/{lanternId}
     *
     * 나중에 관리자 권한을 붙인다.
     */
    @DeleteMapping("/{lanternId}")
    public ResponseEntity<ApiResponse<Void>> deleteLantern(
            @PathVariable Long lanternId
    ) {

        lanternService.deleteLantern(lanternId);

        return ResponseEntity.ok(
            ApiResponse.success(
                "연등이 삭제되었습니다.",
                null
            )
        );
    }
}