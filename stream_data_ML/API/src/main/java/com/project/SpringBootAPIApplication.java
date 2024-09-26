package com.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class SpringBootAPIApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootAPIApplication.class);
    }
    @Bean(name = "apiRestTemplate")
    public RestTemplate apiRestTemplate() {
        return new RestTemplate();
    }
}