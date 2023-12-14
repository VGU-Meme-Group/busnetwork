package com.project.Controller;

import com.project.Service.WriteToJsonFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WriteTrainingDataListToFile {

    @Autowired
    private WriteToJsonFile writeToJsonFile;

    private static final String FILE_PATH = "./training_data.json";
    @GetMapping("/trainingData/generateJson")
    public ResponseEntity<String> generateJson(String filePath) {
            writeToJsonFile.convertContentsInFileToListOfJsonObjects(FILE_PATH);
            return ResponseEntity.ok("Successfully generate Json");
    }
}
