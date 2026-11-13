package com.sprevn.service;

import com.sprevn.entity.Magazine;
import com.sprevn.mapper.MagazineMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MagazineService {

    private final MagazineMapper magazineMapper;

    private int getOffset(int page, int size) {
        if (page < 1 || size < 1 || size > 100) {
            throw new IllegalArgumentException("페이지는 1 이상, 페이지 크기는 1~100이어야 합니다.");
        }
        return (page - 1) * size;
    }

    public List<Magazine> getAllMagazines(int page, int size) {
        return magazineMapper.findAll(getOffset(page, size), size);
    }

    public List<Magazine> getPublishedMagazines(int page, int size) {
        return magazineMapper.findPublished(getOffset(page, size), size);
    }

    public int getTotalCount() {
        return magazineMapper.countAll();
    }

    public int getPublishedCount() {
        return magazineMapper.countPublished();
    }

    public int getPublishedCountByCategory(String category) {
        return magazineMapper.countPublishedByCategory(category);
    }

    public Magazine getMagazine(Long magazineId) {
        Magazine magazine = magazineMapper.findByMagazineId(magazineId)
                .orElseThrow(() -> new IllegalArgumentException("매거진을 찾을 수 없습니다"));
        if (!Integer.valueOf(1).equals(magazine.getStatus())) {
            throw new IllegalArgumentException("공개된 매거진이 아닙니다.");
        }
        magazineMapper.increaseViewCount(magazineId);
        return magazine;
    }

    public Magazine getAdminMagazine(Long magazineId) {
        return magazineMapper.findByMagazineId(magazineId)
                .orElseThrow(() -> new IllegalArgumentException("매거진을 찾을 수 없습니다"));
    }

    public List<Magazine> getMagazinesByCategory(String category, int page, int size) {
        return magazineMapper.findByCategory(category, getOffset(page, size), size);
    }

    public void createMagazine(Magazine magazine) {
        validate(magazine);
        magazineMapper.insert(magazine);
    }

    public void updateMagazine(Magazine magazine) {
        getAdminMagazine(magazine.getMagazineId());
        validate(magazine);
        magazineMapper.update(magazine);
    }

    public void deleteMagazine(Long magazineId) {
        getAdminMagazine(magazineId);
        magazineMapper.delete(magazineId);
    }

    private void validate(Magazine magazine) {
        if (magazine.getTitle() == null || magazine.getTitle().isBlank()) {
            throw new IllegalArgumentException("매거진 제목을 입력해 주세요.");
        }
        if (magazine.getTitle().length() > 200) {
            throw new IllegalArgumentException("매거진 제목은 200자 이내로 입력해 주세요.");
        }
        if (magazine.getCategory() != null && magazine.getCategory().length() > 100) {
            throw new IllegalArgumentException("카테고리는 100자 이내로 입력해 주세요.");
        }
        if (magazine.getThumbnail() != null && magazine.getThumbnail().length() > 500) {
            throw new IllegalArgumentException("썸네일 주소는 500자 이내로 입력해 주세요.");
        }
        if (magazine.getStatus() == null) {
            magazine.setStatus(0);
        }
        if (magazine.getStatus() != 0 && magazine.getStatus() != 1) {
            throw new IllegalArgumentException("매거진 상태는 0(비공개) 또는 1(공개)이어야 합니다.");
        }
    }
}
