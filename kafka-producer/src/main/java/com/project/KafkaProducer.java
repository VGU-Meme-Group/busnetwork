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

@Service // @Service annotation for this KafkaProducer class, so that Spring Boot will scan this class as a BEAN. Without this annotation, Spring Boot will NOT treat this class as a Spring Bean, and it will not work
public class KafkaProducer {
    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducer.class);
    @Value("${kafka.topic.name}")
    private String kafkaTopic;

    // KafkaTemplate is used to send messages to Topic
    // KafkaTemplate<String, VehicleInfoEntity>: defines the "key", and "value" data type of a Kafka Message
    // "Key": is used to route, and partition Kafka messages to Kafka Topic
    // "Value": is used to specify the data type of the message's payload. Here, we send VehicleInfoEntity object as the message's payload
    private KafkaTemplate<String, VehicleInfoEntity> kafkaTemplate;

    // property injection for ObjectMapper object from "Jackson" dependency, which is used to: convert between Java object to JSON
    @Autowired
    private ObjectMapper objectMapper;

    // constructor dependency injection for KafkaTemplate
    public KafkaProducer(KafkaTemplate<String, VehicleInfoEntity> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedRate = 45000) // run this function again to fetch realtime data every 45 seconds
    public void fetchRealTime() throws Exception {

        try {
            URL url = new URL("http://gtfs.gcrta.org/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb");

            // parse/read the realtime data from .pb to FeedMessage object, which is the structure of a message, defined in the .proto file
            FeedMessage feed = FeedMessage.parseFrom(url.openStream());
            for (FeedEntity entity : feed.getEntityList()) {
                if (entity.hasVehicle()) {
//                    String vehicleInfo = entity.getVehicle().toString();
//                    LOGGER.info(vehicleInfo);
//
//                    // Send the vehicle information to the Kafka topic
//                    kafkaTemplate.send(kafkaTopic, vehicleInfo);

                    //-------------------------------------------------------------
                    // Process for Kafka Producer to parse and convert realtime data (in protobuff format) to JSON
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

                    // Use ObjectId.get() to generate a unique ObjectId
                    ObjectId id = ObjectId.get();
                    String hexId = id.toHexString();

                    VehicleInfoEntity vehicleInfoEntity = new VehicleInfoEntity(hexId,
                            trip,
                            vehicle,
                            position,
                            entity.getVehicle().getTimestamp()
                    );

                    // serialize VehicleInfoEntity object to JSON string
                    String json = objectMapper.writeValueAsString(vehicleInfoEntity);
                    //--------------------------------------------------------


                    // build the message to be sent to Topic (the message's payload is VehicleInfoEntity object, which is a Java Object, not JSON)
                    Message<VehicleInfoEntity> message = MessageBuilder
                            .withPayload(vehicleInfoEntity)
                                    .setHeader(KafkaHeaders.TOPIC, "gtfs-realtime")
                                            .build();
                    // use KafkaTemplate to send the message (contain Java Object) to Topic.
                    // But, the Java Object is automatically converted/serialized to JSON, due to the property specified in application.properties of Kafka Producer
                    // Therefore, JSON format of VehicleInfoEntity will be sent to Topic
                    kafkaTemplate.send(message);
                    // log the message payload (which is the VehicleInfoEntity object serialized in JSON) to the console
                    LOGGER.info(json);
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error occurred: " + e.getMessage(), e);
        }
    }
}

