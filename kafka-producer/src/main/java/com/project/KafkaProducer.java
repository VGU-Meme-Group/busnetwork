package com.project;

import java.net.URL;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.transit.realtime.GtfsRealtime.FeedEntity;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import com.project.Entity.Position;
import com.project.Entity.Trip;
import com.project.Entity.Vehicle;
import com.project.Entity.VehicleInfoEntity;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducer.class);
    @Value("${kafka.topic.name}")
    private String kafkaTopic;

    private KafkaTemplate<String, VehicleInfoEntity> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public KafkaProducer(KafkaTemplate<String, VehicleInfoEntity> kafkaTemplate) {
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
//                    String vehicleInfo = entity.getVehicle().toString();
//                    LOGGER.info(vehicleInfo);
//
//                    // Send the vehicle information to the Kafka topic
//                    kafkaTemplate.send(kafkaTopic, vehicleInfo);
                    Trip trip = new Trip(entity.getVehicle().getTrip().getTripId(),
                            entity.getVehicle().getTrip().getRouteId(),
                            entity.getVehicle().getTrip().getDirectionId(),
                            entity.getVehicle().getTrip().getStartDate());

                    Vehicle vehicle = new Vehicle(entity.getVehicle().getVehicle().getId(),
                            entity.getVehicle().getVehicle().getLabel());

                    Position position = new Position(entity.getVehicle().getPosition().getLatitude(),
                            entity.getVehicle().getPosition().getLongitude(),
                            entity.getVehicle().getPosition().getBearing(),
                            entity.getVehicle().getPosition().getSpeed());
                    VehicleInfoEntity vehicleInfoEntity = new VehicleInfoEntity(null,
                            trip,
                            vehicle,
                            position,
                            entity.getVehicle().getTimestamp()
                    );

                    String json = objectMapper.writeValueAsString(vehicleInfoEntity);
                    //kafkaTemplate.send(kafkaTopic, json);
                    Message<VehicleInfoEntity> message = MessageBuilder
                            .withPayload(vehicleInfoEntity)
                                    .setHeader(KafkaHeaders.TOPIC, "gtfs-realtime")
                                            .build();
                    kafkaTemplate.send(message);
                    LOGGER.info(json);
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error occurred: " + e.getMessage(), e);
        }
    }
}

