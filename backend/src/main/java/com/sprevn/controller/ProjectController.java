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

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Project> projects = projectService.getActiveProjects(page, size);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "projects", projects,
                "total", projectService.getTotalCount(),
                "page", page,
                "size", size)));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Project>> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProject(projectId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> createProject(@RequestBody Project project) {
        projectService.createProject(project);
        return ResponseEntity.ok(ApiResponse.success("프로젝트가 등록되었습니다", null));
    }

    @PutMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateProject(@PathVariable Long projectId, @RequestBody Project project) {
        project.setProjectId(projectId);
        projectService.updateProject(project);
        return ResponseEntity.ok(ApiResponse.success("프로젝트가 수정되었습니다", null));
    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok(ApiResponse.success("프로젝트가 삭제되었습니다", null));
    }
}
