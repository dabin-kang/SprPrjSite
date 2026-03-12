package com.sprevn.controller;

import com.sprevn.dto.ApiResponse;
import com.sprevn.entity.Event;
import com.sprevn.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEvents(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Event> events = eventService.getActiveEvents(page, size);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "events", events,
                "total", eventService.getTotalCount(),
                "page", page,
                "size", size)));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Event>> getEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEvent(eventId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> createEvent(@RequestBody Event event) {
        eventService.createEvent(event);
        return ResponseEntity.ok(ApiResponse.success("이벤트가 등록되었습니다", null));
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateEvent(@PathVariable Long eventId, @RequestBody Event event) {
        event.setEventId(eventId);
        eventService.updateEvent(event);
        return ResponseEntity.ok(ApiResponse.success("이벤트가 수정되었습니다", null));
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.ok(ApiResponse.success("이벤트가 삭제되었습니다", null));
    }
}
