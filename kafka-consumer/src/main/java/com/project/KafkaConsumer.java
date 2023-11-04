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
        vehicleInfoRepository.save(vehicleInfo);
        String json = objectMapper.writeValueAsString(vehicleInfo);
        LOGGER.info(json);


    }
}
