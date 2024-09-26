package com.project.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Entity.VehicleInfoEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConvertListOfDocumentsToJson {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConvertListOfDocumentsToJson.class);

    // Method Overloading
    public <T> String convertDocumentsToJson(List<T> documents) {
        ObjectMapper objectMapper = new ObjectMapper();
        String tempList = "";
        try {

            String jsonList = objectMapper.writeValueAsString(documents);
            tempList = jsonList;
            LOGGER.info("Converting list of documents to JSON String: " + jsonList);
            return jsonList;
        } catch (JsonProcessingException e) {
            LOGGER.info("Json List is: " + tempList);
            return "Error converting documents to JSON.";
        }
    }

    public <T> String convertDocumentsToJson(T document) {
        ObjectMapper objectMapper = new ObjectMapper();
        String tempList = "";
        try {

            String jsonObject = objectMapper.writeValueAsString(document);
            tempList = jsonObject;
            LOGGER.info("Converting document to JSON String: " + jsonObject);
            return jsonObject;
        } catch (JsonProcessingException e) {
            LOGGER.info("Json Object is: " + tempList);
            return "Error converting documents to JSON.";
        }
    }
}
