package com.project;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Entity.VehicleInfoEntity;
import com.project.Repository.VehicleInfoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VehicleInfoRepository vehicleInfoRepository;

    // create a consume() function to listen to messages of a particular topic
    @KafkaListener(topics = "gtfs-realtime", groupId = "myGroup")
    public void consume(VehicleInfoEntity vehicleInfo) throws JsonProcessingException {

        //VehicleInfoEntity entity = objectMapper.readValue(vehicleInfo, VehicleInfoEntity.class);

        //vehicleInfoRepository.save(entity);
//        LOGGER.info(String.format(vehicleInfo.toString()));
        
        // the received message is in JSON format of the VehicleInfoEntity
        // But, this JSON is then deserialized into VehicleInfoEntity object (defined in the Kafka-Consumer module, not in the Kafla-Producer module), due to the property specified in application.properties in Kafka Consumer
        // insert this object into MongoDB
        vehicleInfoRepository.save(vehicleInfo);
        // use objectMapper.writeValueAsString(): to serialize Java Object to JSON string
        String json = objectMapper.writeValueAsString(vehicleInfo);
        // log the JSON string of the VehicleInfoEntity object, to the console
        LOGGER.info(json);


    }
}
