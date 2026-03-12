package com.sprevn.service;

import com.sprevn.entity.Project;
import com.sprevn.mapper.ProjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectMapper projectMapper;

    public List<Project> getActiveProjects(int page, int size) {
        int offset = (page - 1) * size;
        return projectMapper.findActive(offset, size);
    }

    public List<Project> getAllProjects(int page, int size) {
        int offset = (page - 1) * size;
        return projectMapper.findAll(offset, size);
    }

    public int getTotalCount() {
        return projectMapper.countAll();
    }

    public Project getProject(Long projectId) {
        return projectMapper.findByProjectId(projectId)
                .orElseThrow(() -> new IllegalArgumentException("프로젝트를 찾을 수 없습니다"));
    }

    public void createProject(Project project) {
        projectMapper.insert(project);
    }

    public void updateProject(Project project) {
        getProject(project.getProjectId());
        projectMapper.update(project);
    }

    public void deleteProject(Long projectId) {
        getProject(projectId);
        projectMapper.delete(projectId);
    }
}
