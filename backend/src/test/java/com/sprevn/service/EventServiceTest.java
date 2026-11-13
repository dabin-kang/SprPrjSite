package com.sprevn.service;

import com.sprevn.entity.Event;
import com.sprevn.mapper.EventMapper;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class EventServiceTest {

    private final EventMapper eventMapper = mock(EventMapper.class);
    private final EventService eventService = new EventService(eventMapper);

    @Test
    void preservesNullableFieldsWhenUpdateDoesNotRequestClearing() {
        Event existing = existingEvent();
        when(eventMapper.findByEventId(1L)).thenReturn(Optional.of(existing));

        Event request = new Event();
        request.setEventId(1L);
        request.setTitle("Updated event");

        eventService.updateEvent(request, false, false, false);

        verify(eventMapper).update(any(Event.class));
        assertEquals("existing.jpg", request.getImageUrl());
        assertEquals(LocalDate.of(2026, 6, 1), request.getStartDate());
        assertEquals(LocalDate.of(2026, 6, 30), request.getEndDate());
    }

    @Test
    void clearsNullableFieldsWhenUpdateExplicitlyRequestsClearing() {
        Event existing = existingEvent();
        when(eventMapper.findByEventId(1L)).thenReturn(Optional.of(existing));

        Event request = new Event();
        request.setEventId(1L);
        request.setTitle("Updated event");

        eventService.updateEvent(request, true, true, true);

        verify(eventMapper).update(any(Event.class));
        assertNull(request.getImageUrl());
        assertNull(request.getStartDate());
        assertNull(request.getEndDate());
    }

    private Event existingEvent() {
        return Event.builder()
                .eventId(1L)
                .title("Original event")
                .content("Original content")
                .imageUrl("existing.jpg")
                .startDate(LocalDate.of(2026, 6, 1))
                .endDate(LocalDate.of(2026, 6, 30))
                .status(1)
                .build();
    }
}
