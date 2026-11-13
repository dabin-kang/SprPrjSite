package com.sprevn.mapper;

import com.sprevn.entity.ProjectImage;
import com.sprevn.entity.ProjectSection;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProjectContentMapper {

    @Select("""
        SELECT section_id, project_id, title, content, section_type, sort_order, created_at
        FROM spr_project_section
        WHERE project_id = #{projectId}
        ORDER BY sort_order ASC, section_id ASC
        """)
    List<ProjectSection> findSections(@Param("projectId") Long projectId);

    @Select("""
        SELECT image_id, project_id, section_id, image_url, image_alt, image_type, sort_order, created_at
        FROM spr_project_image
        WHERE project_id = #{projectId}
        ORDER BY sort_order ASC, image_id ASC
        """)
    List<ProjectImage> findImages(@Param("projectId") Long projectId);

    @Delete("DELETE FROM spr_project_section WHERE project_id = #{projectId}")
    int deleteSections(@Param("projectId") Long projectId);

    @Delete("DELETE FROM spr_project_image WHERE project_id = #{projectId}")
    int deleteImages(@Param("projectId") Long projectId);

    @Insert("""
        INSERT INTO spr_project_section (project_id, title, content, section_type, sort_order, created_at)
        VALUES (#{projectId}, #{title}, #{content}, #{sectionType}, #{sortOrder}, NOW())
        """)
    @Options(useGeneratedKeys = true, keyProperty = "sectionId")
    int insertSection(ProjectSection section);

    @Insert("""
        INSERT INTO spr_project_image (project_id, section_id, image_url, image_alt, image_type, sort_order, created_at)
        VALUES (#{projectId}, #{sectionId}, #{imageUrl}, #{imageAlt}, #{imageType}, #{sortOrder}, NOW())
        """)
    @Options(useGeneratedKeys = true, keyProperty = "imageId")
    int insertImage(ProjectImage image);
}
