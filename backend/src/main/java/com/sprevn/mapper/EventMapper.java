package com.sprevn.mapper;

import com.sprevn.entity.Event;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface EventMapper {

    @Select("SELECT * FROM spr_event ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Event> findAll(@Param("offset") int offset, @Param("size") int size);

    @Select("SELECT COUNT(*) FROM spr_event")
    int countAll();

    @Select("SELECT * FROM spr_event WHERE event_id = #{eventId}")
    Optional<Event> findByEventId(Long eventId);

    @Select("SELECT * FROM spr_event WHERE status = 1 ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Event> findActive(@Param("offset") int offset, @Param("size") int size);

    @Insert("""
        INSERT INTO spr_event (title, content, image_url, start_date, end_date, status, created_by, created_at)
        VALUES (#{title}, #{content}, #{imageUrl}, #{startDate}, #{endDate}, 1, #{createdBy}, NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "eventId")
    int insert(Event event);

    @Update("""
        UPDATE spr_event
        SET title = #{title}, content = #{content}, image_url = #{imageUrl},
            start_date = #{startDate}, end_date = #{endDate}, status = #{status}
        WHERE event_id = #{eventId}
    """)
    int update(Event event);

    @Delete("DELETE FROM spr_event WHERE event_id = #{eventId}")
    int delete(Long eventId);
}
