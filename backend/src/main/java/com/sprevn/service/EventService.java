package com.sprevn.service;

import com.sprevn.entity.Event;
import com.sprevn.mapper.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventMapper eventMapper;

    private int getOffset(int page, int size) {
        if (page < 1 || size < 1 || size > 100) {
            throw new IllegalArgumentException("페이지는 1 이상, 페이지 크기는 1~100이어야 합니다.");
        }
        return (page - 1) * size;
    }

    public List<Event> getActiveEvents(int page, int size) {
        return eventMapper.findActive(getOffset(page, size), size);
    }

    public List<Event> getAllEvents(int page, int size) {
        return eventMapper.findAll(getOffset(page, size), size);
    }

    public int getTotalCount() {
        return eventMapper.countAll();
    }

    public int getActiveCount() {
        return eventMapper.countActive();
    }

    public Event getEvent(Long eventId) {
        Event event = eventMapper.findByEventId(eventId)
                .orElseThrow(() -> new IllegalArgumentException("이벤트를 찾을 수 없습니다"));
        if (!Integer.valueOf(1).equals(event.getStatus())) {
            throw new IllegalArgumentException("공개된 이벤트가 아닙니다.");
        }
        return event;
    }

    private Event getExistingEvent(Long eventId) {
        if (eventId == null || eventId < 1) {
            throw new IllegalArgumentException("올바르지 않은 이벤트 ID입니다.");
        }
        return eventMapper.findByEventId(eventId)
            .orElseThrow(() -> new IllegalArgumentException("이벤트를 찾을 수 없습니다"));
    }

    private void validate(Event event) {
        if (event.getTitle() == null || event.getTitle().isBlank()) {
            throw new IllegalArgumentException("이벤트 제목을 입력해 주세요.");
        }
        if (event.getTitle().length() > 200) {
            throw new IllegalArgumentException("이벤트 제목은 200자 이내로 입력해 주세요.");
        }
        if (event.getImageUrl() != null && event.getImageUrl().length() > 500) {
            throw new IllegalArgumentException("이벤트 이미지 주소는 500자 이내여야 합니다.");
        }
        if (event.getStatus() == null) {
            event.setStatus(1);
        }
        if (event.getStatus() != 0 && event.getStatus() != 1) {
            throw new IllegalArgumentException("이벤트 상태는 0 또는 1이어야 합니다.");
        }
        LocalDate startDate = event.getStartDate();
        LocalDate endDate = event.getEndDate();
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("이벤트 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }

    public void createEvent(Event event) {
        validate(event);
        eventMapper.insert(event);
    }

    public void updateEvent(
            Event event,
            boolean clearImageUrl,
            boolean clearStartDate,
            boolean clearEndDate) {
        Event existing = getExistingEvent(event.getEventId());
        if (event.getTitle() == null) event.setTitle(existing.getTitle());
        if (event.getContent() == null) event.setContent(existing.getContent());
        if (event.getImageUrl() == null && !clearImageUrl) event.setImageUrl(existing.getImageUrl());
        if (event.getStartDate() == null && !clearStartDate) event.setStartDate(existing.getStartDate());
        if (event.getEndDate() == null && !clearEndDate) event.setEndDate(existing.getEndDate());
        if (event.getStatus() == null) event.setStatus(existing.getStatus());
        validate(event);
        eventMapper.update(event);
    }

    public void deleteEvent(Long eventId) {
        getExistingEvent(eventId);
        eventMapper.delete(eventId);
    }
}
