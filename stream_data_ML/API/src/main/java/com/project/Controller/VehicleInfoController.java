package com.project.Controller;

import com.project.Entity.VehicleInfoEntity;
import com.project.Service.ConvertListOfDocumentsToJson;
import com.project.Service.VehicleInfoService;
import com.project.Service.WriteToJsonFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class VehicleInfoController {

    private VehicleInfoService vehicleInfoService;

    private ConvertListOfDocumentsToJson convertListOfDocumentsToJson;

    private WriteToJsonFile writeToJsonFile;

    public VehicleInfoController(VehicleInfoService vehicleInfoService, ConvertListOfDocumentsToJson convertListOfDocumentsToJson, WriteToJsonFile writeToJsonFile) {
        this.vehicleInfoService = vehicleInfoService;
        this.convertListOfDocumentsToJson = convertListOfDocumentsToJson;
        this.writeToJsonFile = writeToJsonFile;
    }

    @GetMapping("/generate-json")
    public String generateJsonFile() {
        List<VehicleInfoEntity> documents = vehicleInfoService.getAllDocuments();
        String json = convertListOfDocumentsToJson.convertDocumentsToJson(documents);

        // Write the JSON data to a file (adjust the file path)
        String filePath = "./vehicle_position.json";
        writeToJsonFile.writeFile(filePath, json);

        return "JSON file generated successfully.";
    }
}
