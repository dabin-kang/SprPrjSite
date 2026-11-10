
package com.sprevn.controller;

import com.sprevn.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectImageController {

    private final SupabaseStorageService storageService;

    @PostMapping(
            value = "/upload-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadProjectImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("slug") String slug
    ) {
        try {
            String imagePath = storageService.uploadProjectImage(file, slug);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "imageUrl", imagePath,
                    "message", "이미지가 업로드되었습니다."
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                    "success", false,
                    "message", "이미지 업로드에 실패했습니다: " + e.getMessage()
            ));
        }
    }
}
