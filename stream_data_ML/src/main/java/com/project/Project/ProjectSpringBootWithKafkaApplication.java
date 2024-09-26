package com.project.Project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProjectSpringBootWithKafkaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectSpringBootWithKafkaApplication.class, args);
	}

}
