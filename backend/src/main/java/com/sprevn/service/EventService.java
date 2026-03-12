package com.sprevn.service;

import com.sprevn.entity.Event;
import com.sprevn.mapper.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventMapper eventMapper;

    public List<Event> getActiveEvents(int page, int size) {
        int offset = (page - 1) * size;
        return eventMapper.findActive(offset, size);
    }

    public List<Event> getAllEvents(int page, int size) {
        int offset = (page - 1) * size;
        return eventMapper.findAll(offset, size);
    }

    public int getTotalCount() {
        return eventMapper.countAll();
    }

    public Event getEvent(Long eventId) {
        return eventMapper.findByEventId(eventId)
                .orElseThrow(() -> new IllegalArgumentException("이벤트를 찾을 수 없습니다"));
    }

    public void createEvent(Event event) {
        eventMapper.insert(event);
    }

    public void updateEvent(Event event) {
        getEvent(event.getEventId());
        eventMapper.update(event);
    }

    public void deleteEvent(Long eventId) {
        getEvent(eventId);
        eventMapper.delete(eventId);
    }
}
