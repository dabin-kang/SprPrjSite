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

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://spr-prj-site.vercel.app/") // 프론트엔드 주소 입력
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}