package com.project;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    // create a consume() function to listen to messages of a particular topic
    @KafkaListener(topics = "gtfs-realtime", groupId = "myGroup")
    public void consume(String vehicleInfo) {
        LOGGER.info(String.format(vehicleInfo));

    }
}
