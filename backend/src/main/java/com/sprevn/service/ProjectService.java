
package com.sprevn.service;

import com.sprevn.entity.Project;
import com.sprevn.entity.ProjectImage;
import com.sprevn.entity.ProjectSection;
import com.sprevn.mapper.ProjectContentMapper;
import com.sprevn.mapper.ProjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectMapper projectMapper;
    private final ProjectContentMapper projectContentMapper;

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
            project.getStatus() != 1 &&
            project.getStatus() != 2) {
            throw new IllegalArgumentException(
                "프로젝트 상태는 0(임시저장), 1(공개), 2(비공개) 중 하나여야 합니다."
            );
        }

        if (project.getSortOrder() == null) {
            project.setSortOrder(0);
        }

        if (project.getSortOrder() < 0) {
            throw new IllegalArgumentException("정렬 순서는 0 이상이어야 합니다.");
        }

        int slugMatches = project.getProjectId() == null
            ? projectMapper.countBySlug(project.getSlug())
            : projectMapper.countBySlugExcludingProject(project.getSlug(), project.getProjectId());
        if (slugMatches > 0) {
            throw new IllegalArgumentException("이미 사용 중인 프로젝트 URL 식별자입니다.");
        }

        int projectNoMatches = project.getProjectId() == null
            ? projectMapper.countByProjectNo(project.getProjectNo())
            : projectMapper.countByProjectNoExcludingProject(project.getProjectNo(), project.getProjectId());
        if (projectNoMatches > 0) {
            throw new IllegalArgumentException("이미 사용 중인 프로젝트 번호입니다.");
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

        Project project = projectMapper.findByProjectId(projectId)
            .orElseThrow(() -> new IllegalArgumentException(
                "프로젝트를 찾을 수 없습니다."
            ));

        List<ProjectSection> sections = projectContentMapper.findSections(projectId);
        List<ProjectImage> images = projectContentMapper.findImages(projectId);
        for (ProjectSection section : sections) {
            section.setImages(images.stream()
                .filter(image -> Objects.equals(image.getSectionId(), section.getSectionId()))
                .toList());
        }
        project.setSections(sections);
        return project;
    }

    // 프로젝트 등록
    public void createProject(Project project) {

        validateProject(project);

        if (project.getStatus() == 1 &&
            project.getPublishedAt() == null) {
            project.setPublishedAt(LocalDateTime.now());
        }

        projectMapper.insert(project);
        if (project.getSections() != null) {
            saveSections(project.getProjectId(), project.getSections());
        }
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

        if (request.getSections() != null) {
            saveSections(existing.getProjectId(), request.getSections());
        }
    }

    private void saveSections(Long projectId, List<ProjectSection> sections) {
        projectContentMapper.deleteImages(projectId);
        projectContentMapper.deleteSections(projectId);
        for (int sectionIndex = 0; sectionIndex < sections.size(); sectionIndex++) {
            ProjectSection section = sections.get(sectionIndex);
            if (section == null || section.getTitle() == null || section.getTitle().isBlank()) {
                throw new IllegalArgumentException("모든 프로젝트 섹션에 제목을 입력해 주세요.");
            }
            if (section.getTitle().length() > 200) {
                throw new IllegalArgumentException("섹션 제목은 200자 이내로 입력해 주세요.");
            }
            if (section.getSortOrder() == null) {
                section.setSortOrder(sectionIndex);
            }
            if (section.getSortOrder() < 0) {
                throw new IllegalArgumentException("섹션 정렬 순서는 0 이상이어야 합니다.");
            }
            if (section.getSectionType() == null || section.getSectionType().isBlank()) {
                section.setSectionType("TEXT");
            }
            if (section.getSectionType().length() > 50) {
                throw new IllegalArgumentException("섹션 유형은 50자 이내로 입력해 주세요.");
            }

            section.setProjectId(projectId);
            projectContentMapper.insertSection(section);

            List<ProjectImage> images = section.getImages() == null
                ? List.of()
                : section.getImages();
            for (int imageIndex = 0; imageIndex < images.size(); imageIndex++) {
                ProjectImage image = images.get(imageIndex);
                if (image == null || image.getImageUrl() == null || image.getImageUrl().isBlank()) {
                    throw new IllegalArgumentException("섹션 이미지 경로를 입력해 주세요.");
                }
                if (image.getImageUrl().length() > 1000) {
                    throw new IllegalArgumentException("이미지 경로는 1000자 이내여야 합니다.");
                }
                if (image.getImageAlt() != null && image.getImageAlt().length() > 300) {
                    throw new IllegalArgumentException("이미지 대체 텍스트는 300자 이내여야 합니다.");
                }
                if (image.getSortOrder() == null) {
                    image.setSortOrder(imageIndex);
                }
                if (image.getSortOrder() < 0) {
                    throw new IllegalArgumentException("이미지 정렬 순서는 0 이상이어야 합니다.");
                }

                image.setProjectId(projectId);
                image.setSectionId(section.getSectionId());
                if (image.getImageType() == null || image.getImageType().isBlank()) {
                    image.setImageType("CONTENT");
                }
                projectContentMapper.insertImage(image);
            }
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
