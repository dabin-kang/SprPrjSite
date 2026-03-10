package com.spr.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @GetMapping("/test")
    public Map<String, String> test() {

        Map<String,String> result = new HashMap<>();

        result.put("message","SPR backend connected");

        return result;
    }
}