package com.sprevn.mapper;

import com.sprevn.entity.Project;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ProjectMapper {

    @Select("SELECT * FROM spr_project ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Project> findAll(@Param("offset") int offset, @Param("size") int size);

    @Select("SELECT COUNT(*) FROM spr_project")
    int countAll();

    @Select("SELECT * FROM spr_project WHERE project_id = #{projectId}")
    Optional<Project> findByProjectId(Long projectId);

    @Select("SELECT * FROM spr_project WHERE status = 1 ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Project> findActive(@Param("offset") int offset, @Param("size") int size);

    @Insert("""
        INSERT INTO spr_project (title, description, tech_stack, image_url, project_url, status, created_by, created_at)
        VALUES (#{title}, #{description}, #{techStack}, #{imageUrl}, #{projectUrl}, 1, #{createdBy}, NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "projectId")
    int insert(Project project);

    @Update("""
        UPDATE spr_project
        SET title = #{title}, description = #{description}, tech_stack = #{techStack},
            image_url = #{imageUrl}, project_url = #{projectUrl}, status = #{status}
        WHERE project_id = #{projectId}
    """)
    int update(Project project);

    @Delete("DELETE FROM spr_project WHERE project_id = #{projectId}")
    int delete(Long projectId);
}
