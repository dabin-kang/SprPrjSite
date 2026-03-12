package com.sprevn;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.sprevn.mapper")
public class SprevnApplication {
    public static void main(String[] args) {
        SpringApplication.run(SprevnApplication.class, args);
    }
}
