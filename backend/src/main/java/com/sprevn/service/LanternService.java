```java
package com.sprevn.service;

import com.sprevn.entity.Lantern;
import com.sprevn.mapper.LanternMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanternService {

    private final LanternMapper lanternMapper;


    /*
     * 전체 연등 조회
     */
    public List<Lantern> getAllLanterns() {
        return lanternMapper.findAll();
    }


    /*
     * 연등 하나 조회
     */
    public Lantern getLantern(Long lanternId) {
        return lanternMapper.findById(lanternId)
                .orElseThrow(
                    () -> new IllegalArgumentException(
                        "연등을 찾을 수 없습니다."
                    )
                );
    }


    /*
     * 연등 생성
     */
    public Lantern createLantern(Lantern lantern) {

        validateLantern(lantern);

        lanternMapper.insert(lantern);

        return lantern;
    }


    /*
     * 입력값 검증
     */
    private void validateLantern(Lantern lantern) {

        if (
            lantern.getNickname() == null ||
            lantern.getNickname().trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                "닉네임을 입력해주세요."
            );
        }

        if (
            lantern.getWish() == null ||
            lantern.getWish().trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                "소원을 입력해주세요."
            );
        }

        if (
            lantern.getColor() == null ||
            lantern.getColor().trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                "연등 색상을 선택해주세요."
            );
        }

        if (lantern.getNickname().length() > 30) {
            throw new IllegalArgumentException(
                "닉네임은 30자 이내로 입력해주세요."
            );
        }

        if (lantern.getWish().length() > 500) {
            throw new IllegalArgumentException(
                "소원은 500자 이내로 입력해주세요."
            );
        }
    }


    /*
     * 관리자용 삭제
     */
    public void deleteLantern(Long lanternId) {
        getLantern(lanternId);
        lanternMapper.delete(lanternId);
    }
}
```