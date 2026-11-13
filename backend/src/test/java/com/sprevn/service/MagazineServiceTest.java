package com.sprevn.service;

import com.sprevn.entity.Magazine;
import com.sprevn.mapper.MagazineMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MagazineServiceTest {

    private final MagazineMapper magazineMapper = mock(MagazineMapper.class);
    private final MagazineService magazineService = new MagazineService(magazineMapper);

    @Test
    void createMagazineReturnsGeneratedId() {
        when(magazineMapper.insert(any(Magazine.class))).thenAnswer(invocation -> {
            Magazine magazine = invocation.getArgument(0);
            magazine.setMagazineId(42L);
            return 1;
        });

        Long magazineId = magazineService.createMagazine(
                Magazine.builder().title("새 매거진").status(0).build());

        assertEquals(42L, magazineId);
    }

    @Test
    void createMagazineFailsWhenGeneratedIdIsMissing() {
        when(magazineMapper.insert(any(Magazine.class))).thenReturn(1);

        assertThrows(IllegalStateException.class, () -> magazineService.createMagazine(
                Magazine.builder().title("새 매거진").status(0).build()));
    }
}
