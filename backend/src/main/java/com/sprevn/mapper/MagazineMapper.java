package com.sprevn.mapper;

import com.sprevn.entity.Magazine;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MagazineMapper {

    @Select("SELECT * FROM spr_magazine ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Magazine> findAll(@Param("offset") int offset, @Param("size") int size);

    @Select("SELECT COUNT(*) FROM spr_magazine")
    int countAll();

    @Select("SELECT * FROM spr_magazine WHERE magazine_id = #{magazineId}")
    Optional<Magazine> findByMagazineId(Long magazineId);

    @Select("SELECT * FROM spr_magazine WHERE status = 1 AND category = #{category} ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Magazine> findByCategory(@Param("category") String category, @Param("offset") int offset, @Param("size") int size);

    @Insert("""
        INSERT INTO spr_magazine (title, content, category, thumbnail, view_count, status, created_by, created_at)
        VALUES (#{title}, #{content}, #{category}, #{thumbnail}, 0, 1, #{createdBy}, NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "magazineId")
    int insert(Magazine magazine);

    @Update("""
        UPDATE spr_magazine
        SET title = #{title}, content = #{content}, category = #{category},
            thumbnail = #{thumbnail}, status = #{status}
        WHERE magazine_id = #{magazineId}
    """)
    int update(Magazine magazine);

    @Update("UPDATE spr_magazine SET view_count = view_count + 1 WHERE magazine_id = #{magazineId}")
    int increaseViewCount(Long magazineId);

    @Delete("DELETE FROM spr_magazine WHERE magazine_id = #{magazineId}")
    int delete(Long magazineId);
}
