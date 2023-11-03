package com.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan("com.project")
@EnableScheduling
public class SpringBootProducerApplication {
    public static void main(String[] args) {

        SpringApplication.run(SpringBootProducerApplication.class, args);
    }
}