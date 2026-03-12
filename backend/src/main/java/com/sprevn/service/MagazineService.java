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

    public List<Magazine> getAllMagazines(int page, int size) {
        int offset = (page - 1) * size;
        return magazineMapper.findAll(offset, size);
    }

    public int getTotalCount() {
        return magazineMapper.countAll();
    }

    public Magazine getMagazine(Long magazineId) {
        Magazine magazine = magazineMapper.findByMagazineId(magazineId)
                .orElseThrow(() -> new IllegalArgumentException("매거진을 찾을 수 없습니다"));
        magazineMapper.increaseViewCount(magazineId);
        return magazine;
    }

    public List<Magazine> getMagazinesByCategory(String category, int page, int size) {
        int offset = (page - 1) * size;
        return magazineMapper.findByCategory(category, offset, size);
    }

    public void createMagazine(Magazine magazine) {
        magazineMapper.insert(magazine);
    }

    public void updateMagazine(Magazine magazine) {
        getMagazine(magazine.getMagazineId());
        magazineMapper.update(magazine);
    }

    public void deleteMagazine(Long magazineId) {
        getMagazine(magazineId);
        magazineMapper.delete(magazineId);
    }
}
