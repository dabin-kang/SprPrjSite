
package com.sprevn.mapper;

import com.sprevn.entity.Project;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface ProjectMapper {

    // 관리자용 전체 프로젝트 목록
    @Select("""
        SELECT *
        FROM spr_project
        ORDER BY sort_order ASC, created_at DESC
        LIMIT #{size} OFFSET #{offset}
    """)
    List<Project> findAll(
        @Param("offset") int offset,
        @Param("size") int size
    );

    // 전체 프로젝트 개수
    @Select("""
        SELECT COUNT(*)
        FROM spr_project
    """)
    int countAll();

    // 공개 프로젝트 개수
    @Select("""
        SELECT COUNT(*)
        FROM spr_project
        WHERE status = 1
    """)
    int countActive();

    // 프로젝트 ID로 상세 조회
    @Select("""
        SELECT *
        FROM spr_project
        WHERE project_id = #{projectId}
    """)
    Optional<Project> findByProjectId(
        @Param("projectId") Long projectId
    );

    // 공개 프로젝트 목록
    @Select("""
        SELECT *
        FROM spr_project
        WHERE status = 1
        ORDER BY sort_order ASC, created_at DESC
        LIMIT #{size} OFFSET #{offset}
    """)
    List<Project> findActive(
        @Param("offset") int offset,
        @Param("size") int size
    );

    // 프로젝트 등록
    @Insert("""
        INSERT INTO spr_project (
            title,
            description,
            tech_stack,
            image_url,
            project_url,
            status,
            created_by,
            slug,
            project_no,
            category,
            published_at,
            sort_order,
            created_at
        )
        VALUES (
            #{title},
            #{description},
            #{techStack},
            #{imageUrl},
            #{projectUrl},
            COALESCE(#{status}, 1),
            #{createdBy},
            #{slug},
            #{projectNo},
            #{category},
            #{publishedAt},
            COALESCE(#{sortOrder}, 0),
            NOW()
        )
    """)
    @Options(
        useGeneratedKeys = true,
        keyProperty = "projectId"
    )
    int insert(Project project);

    // 프로젝트 수정
    @Update("""
        UPDATE spr_project
        SET
            title = #{title},
            description = #{description},
            tech_stack = #{techStack},
            image_url = #{imageUrl},
            project_url = #{projectUrl},
            status = #{status},
            slug = #{slug},
            project_no = #{projectNo},
            category = #{category},
            published_at = #{publishedAt},
            sort_order = #{sortOrder}
        WHERE project_id = #{projectId}
    """)
    int update(Project project);

    // 프로젝트 삭제
    @Delete("""
        DELETE FROM spr_project
        WHERE project_id = #{projectId}
    """)
    int delete(
        @Param("projectId") Long projectId
    );
}
