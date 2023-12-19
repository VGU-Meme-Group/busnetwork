package com.project.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Entity.VehicleInfoEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConvertListOfDocumentsToJson {

    public String convertDocumentsToJson(List<VehicleInfoEntity> documents) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(documents);
        } catch (JsonProcessingException e) {
            return "Error converting documents to JSON.";
        }
    }
}
