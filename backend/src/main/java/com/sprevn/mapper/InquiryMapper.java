package com.sprevn.mapper;

import com.sprevn.entity.Inquiry;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface InquiryMapper {

    @Select("SELECT * FROM spr_inquiry ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<Inquiry> findAll(@Param("offset") int offset, @Param("size") int size);

    @Select("SELECT COUNT(*) FROM spr_inquiry")
    int countAll();

    @Select("SELECT * FROM spr_inquiry WHERE inquiry_id = #{inquiryId}")
    Optional<Inquiry> findByInquiryId(Long inquiryId);

    @Select("SELECT * FROM spr_inquiry WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Inquiry> findByUserId(Long userId);

    @Insert("""
        INSERT INTO spr_inquiry (user_id, name, email, phone, category, title, content, status, created_at)
        VALUES (#{userId}, #{name}, #{email}, #{phone}, #{category}, #{title}, #{content}, 0, NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "inquiryId")
    int insert(Inquiry inquiry);

    @Update("""
        UPDATE spr_inquiry
        SET answer = #{answer}, status = 1, answered_at = NOW()
        WHERE inquiry_id = #{inquiryId}
    """)
    int answer(@Param("inquiryId") Long inquiryId, @Param("answer") String answer);

    @Delete("DELETE FROM spr_inquiry WHERE inquiry_id = #{inquiryId}")
    int delete(Long inquiryId);
}
