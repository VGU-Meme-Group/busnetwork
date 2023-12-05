package com.project;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    // create a Topic
    @Bean
    public NewTopic topic() {
        return TopicBuilder.name("training_data")
                .build();
    }
}
