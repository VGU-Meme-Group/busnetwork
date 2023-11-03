package com.project;

import java.net.URL;

import com.google.transit.realtime.GtfsRealtime.FeedEntity;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducer.class);
    @Value("${kafka.topic.name}")
    private String kafkaTopic;

    private KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedRate = 3000)

    public void fetchRealTime() throws Exception {
        //System.out.println("Hello World1");

        try {
            URL url = new URL("http://gtfs.gcrta.org/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb");
            //System.out.println("Hello World2");
            FeedMessage feed = FeedMessage.parseFrom(url.openStream());
            for (FeedEntity entity : feed.getEntityList()) {
                if (entity.hasVehicle()) {
                    String vehicleInfo = entity.getVehicle().toString();
                    LOGGER.info(vehicleInfo);

                    // Send the vehicle information to the Kafka topic
                    kafkaTemplate.send(kafkaTopic, vehicleInfo);
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error occurred: " + e.getMessage(), e);
        }
    }
}

