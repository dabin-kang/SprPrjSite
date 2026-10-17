package com.sprevn.mapper;

import com.sprevn.entity.Lantern;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface LanternMapper {

    /*
     * 전체 연등 조회
     *
     * 최신 연등부터 가져온다.
     */
    @Select("""
        SELECT
            lantern_id,
            nickname,
            wish,
            color,
            created_at
        FROM spr_lantern
        ORDER BY created_at DESC
    """)
    List<Lantern> findAll();


    /*
     * 연등 하나 조회
     */
    @Select("""
        SELECT
            lantern_id,
            nickname,
            wish,
            color,
            created_at
        FROM spr_lantern
        WHERE lantern_id = #{lanternId}
    """)
    Optional<Lantern> findById(Long lanternId);


    /*
     * 연등 생성
     */
    @Insert("""
        INSERT INTO spr_lantern (
            nickname,
            wish,
            color,
            created_at
        )
        VALUES (
            #{nickname},
            #{wish},
            #{color},
            NOW()
        )
    """)
    @Options(
        useGeneratedKeys = true,
        keyProperty = "lanternId"
    )
    int insert(Lantern lantern);


    /*
     * 연등 삭제
     *
     * 관리자 기능을 만들 때 사용할 수 있다.
     */
    @Delete("""
        DELETE FROM spr_lantern
        WHERE lantern_id = #{lanternId}
    """)
    int delete(Long lanternId);
}