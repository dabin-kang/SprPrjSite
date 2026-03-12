package com.sprevn.mapper;

import com.sprevn.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM spr_sign WHERE id = #{id}")
    Optional<User> findById(String id);

    @Select("SELECT * FROM spr_sign WHERE user_id = #{userId}")
    Optional<User> findByUserId(Long userId);

    @Select("SELECT * FROM spr_sign WHERE email = #{email}")
    Optional<User> findByEmail(String email);

    @Select("SELECT * FROM spr_sign ORDER BY created_at DESC LIMIT #{size} OFFSET #{offset}")
    List<User> findAll(@Param("offset") int offset, @Param("size") int size);

    @Select("SELECT COUNT(*) FROM spr_sign")
    int countAll();

    @Insert("""
        INSERT INTO spr_sign (id, pname, email, gender, phone_number, birthday, address, password, status, created_at)
        VALUES (#{id}, #{pname}, #{email}, #{gender}, #{phoneNumber}, #{birthday}, #{address}, #{password}, 1, NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    int insert(User user);

    @Update("""
        UPDATE spr_sign
        SET pname = #{pname}, email = #{email}, gender = #{gender},
            phone_number = #{phoneNumber}, birthday = #{birthday}, address = #{address}
        WHERE user_id = #{userId}
    """)
    int update(User user);

    @Update("UPDATE spr_sign SET status = #{status} WHERE user_id = #{userId}")
    int updateStatus(@Param("userId") Long userId, @Param("status") Integer status);

    @Update("UPDATE spr_sign SET coming = NOW() WHERE user_id = #{userId}")
    int updateLastLogin(Long userId);

    @Update("UPDATE spr_sign SET password = #{password} WHERE user_id = #{userId}")
    int updatePassword(@Param("userId") Long userId, @Param("password") String password);

    @Delete("DELETE FROM spr_sign WHERE user_id = #{userId}")
    int delete(Long userId);

    @Select("SELECT COUNT(*) FROM spr_sign WHERE id = #{id}")
    int existsById(String id);

    @Select("SELECT COUNT(*) FROM spr_sign WHERE email = #{email}")
    int existsByEmail(String email);
}
