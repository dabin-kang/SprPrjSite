
package com.sprevn.service;

import com.sprevn.entity.Project;
import com.sprevn.mapper.ProjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectMapper projectMapper;

    // 페이지 번호 및 크기 검증
    private int getOffset(int page, int size) {
        if (page < 1) {
            throw new IllegalArgumentException(
                "페이지 번호는 1 이상이어야 합니다."
            );
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                "페이지 크기는 1~100 사이여야 합니다."
            );
        }

        return (page - 1) * size;
    }

    // 프로젝트 정보 검증
    private void validateProject(Project project) {

        if (project.getTitle() == null ||
            project.getTitle().isBlank()) {
            throw new IllegalArgumentException(
                "프로젝트 제목을 입력해 주세요."
            );
        }

        if (project.getSlug() == null ||
            !project.getSlug().matches(
                "[a-z0-9]+(?:-[a-z0-9]+)*"
            )) {
            throw new IllegalArgumentException(
                "URL 식별자는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."
            );
        }

        if (project.getProjectNo() == null ||
            project.getProjectNo() < 1) {
            throw new IllegalArgumentException(
                "프로젝트 번호는 1 이상이어야 합니다."
            );
        }

        if (project.getStatus() == null) {
            project.setStatus(0);
        }

        if (project.getStatus() != 0 &&
            project.getStatus() != 1) {
            throw new IllegalArgumentException(
                "프로젝트 상태는 0 또는 1이어야 합니다."
            );
        }

        if (project.getSortOrder() == null) {
            project.setSortOrder(0);
        }
    }

    // 공개 프로젝트 목록
    @Transactional(readOnly = true)
    public List<Project> getActiveProjects(int page, int size) {
        return projectMapper.findActive(
            getOffset(page, size), size
        );
    }

    // 관리자 전체 프로젝트 목록
    @Transactional(readOnly = true)
    public List<Project> getAllProjects(int page, int size) {
        return projectMapper.findAll(
            getOffset(page, size), size
        );
    }

    // 전체 프로젝트 개수
    @Transactional(readOnly = true)
    public int getTotalCount() {
        return projectMapper.countAll();
    }

    // 공개 프로젝트 개수
    @Transactional(readOnly = true)
    public int getActiveCount() {
        return projectMapper.countActive();
    }

    // 프로젝트 상세 조회
    @Transactional(readOnly = true)
    public Project getProject(Long projectId) {

        if (projectId == null || projectId < 1) {
            throw new IllegalArgumentException(
                "올바르지 않은 프로젝트 ID입니다."
            );
        }

        return projectMapper.findByProjectId(projectId)
            .orElseThrow(() -> new IllegalArgumentException(
                "프로젝트를 찾을 수 없습니다."
            ));
    }

    // 프로젝트 등록
    public void createProject(Project project) {

        validateProject(project);

        if (project.getStatus() == 1 &&
            project.getPublishedAt() == null) {
            project.setPublishedAt(LocalDateTime.now());
        }

        projectMapper.insert(project);
    }

    // 프로젝트 수정
    public void updateProject(Project request) {

        if (request.getProjectId() == null) {
            throw new IllegalArgumentException(
                "수정할 프로젝트 ID가 없습니다."
            );
        }

        Project existing = getProject(request.getProjectId());

        // 전달된 항목만 기존 데이터에 반영
        if (request.getTitle() != null) {
            existing.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }

        if (request.getTechStack() != null) {
            existing.setTechStack(request.getTechStack());
        }

        if (request.getImageUrl() != null) {
            existing.setImageUrl(request.getImageUrl());
        }

        if (request.getProjectUrl() != null) {
            existing.setProjectUrl(request.getProjectUrl());
        }

        if (request.getSlug() != null) {
            existing.setSlug(request.getSlug());
        }

        if (request.getProjectNo() != null) {
            existing.setProjectNo(request.getProjectNo());
        }

        if (request.getCategory() != null) {
            existing.setCategory(request.getCategory());
        }

        if (request.getSortOrder() != null) {
            existing.setSortOrder(request.getSortOrder());
        }

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        // 공개일 관리
        if (request.getPublishedAt() != null) {
            existing.setPublishedAt(request.getPublishedAt());
        } else if (
            existing.getStatus() == 1 &&
            existing.getPublishedAt() == null
        ) {
            existing.setPublishedAt(LocalDateTime.now());
        }

        // 최종 데이터 검증
        validateProject(existing);

        int updated = projectMapper.update(existing);

        if (updated == 0) {
            throw new IllegalArgumentException(
                "프로젝트 수정에 실패했습니다."
            );
        }
    }

    // 프로젝트 삭제
    public void deleteProject(Long projectId) {

        getProject(projectId);

        int deleted = projectMapper.delete(projectId);

        if (deleted == 0) {
            throw new IllegalArgumentException(
                "프로젝트 삭제에 실패했습니다."
            );
        }
    }
}
