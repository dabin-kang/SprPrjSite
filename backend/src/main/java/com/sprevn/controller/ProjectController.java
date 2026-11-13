
package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.entity.Project;
import com.sprevn.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    // 공개 프로젝트 목록
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Project> projects =
                projectService.getActiveProjects(page, size);

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "projects", projects,
                "total", projectService.getActiveCount(),
                "page", page,
                "size", size
        )));
    }

    // 관리자 전체 프로젝트 목록
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Project> projects =
                projectService.getAllProjects(page, size);

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "projects", projects,
                "total", projectService.getTotalCount(),
                "page", page,
                "size", size
        )));
    }

    @GetMapping("/admin/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Project>> getAdminProject(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(
                projectService.getProject(projectId)));
    }

    // 공개 프로젝트 상세 조회
    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Project>> getProject(
            @PathVariable Long projectId) {

        Project project =
                projectService.getProject(projectId);

        if (!Integer.valueOf(1).equals(project.getStatus())) {
            throw new IllegalArgumentException(
                    "공개된 프로젝트가 아닙니다."
            );
        }

        return ResponseEntity.ok(
                ApiResponse.success(project)
        );
    }

    // 프로젝트 등록
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> createProject(
            @RequestBody Project project) {

        projectService.createProject(project);

        return ResponseEntity.ok(
                ApiResponse.success("프로젝트가 등록되었습니다.", null)
        );
    }

    // 프로젝트 수정
    @PutMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateProject(
            @PathVariable Long projectId,
            @RequestBody Project project) {

        project.setProjectId(projectId);
        projectService.updateProject(project);

        return ResponseEntity.ok(
                ApiResponse.success("프로젝트가 수정되었습니다.", null)
        );
    }

    // 프로젝트 삭제
    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable Long projectId) {

        projectService.deleteProject(projectId);

        return ResponseEntity.ok(
                ApiResponse.success("프로젝트가 삭제되었습니다.", null)
        );
    }
}
