package com.project;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Entity.*;
import com.project.Repository.TrainingDataRepository;
import com.project.Repository.VehicleInfoRepository;
import com.project.Service.*;
import jakarta.annotation.PreDestroy;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class KafkaConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaConsumer.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CheckSegment checkSegment;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VehicleInfoRepository vehicleInfoRepository;

    @Autowired
    private TrainingDataRepository trainingDataRepository;

    @Autowired
    private ConvertTimeStampService convertTimeStampService;

    @Autowired
    private ConvertListOfDocumentsToJson convertListOfDocumentsToJson;

    @Autowired
    private WriteToJsonFile writeToJsonFile;
    List<TrainingData> listOfTrainingData = new ArrayList<>();
    private static final String FILE_PATH = "./training_data.json";

    // create a consume() function to listen to messages of a particular topic
    @KafkaListener(topics = "training_data", groupId = "myGroupTraining")
    public void consume(VehicleInfoEntity vehicleInfo) throws JsonProcessingException {
        try {
            Position currentVehiclePosition = vehicleInfo.getPosition();
            LOGGER.info("Current Vehicle Position: " + currentVehiclePosition.toString());
        String routeId = vehicleInfo.getTrip().getRoute_id();
            if (Objects.equals(routeId, "66") || Objects.equals(routeId, "67")) {
                LOGGER.info("Skipping routeId: " + routeId);
                return;
            }
        if(Objects.equals(routeId, "55-55B/C")) {
            routeId = "55-55B-55C";
        }
            if(Objects.equals(routeId, "19-19A/B")) {
                routeId = "19-19A-19B";
            }
        LOGGER.info("routeId: " + routeId);
        String url = "http://localhost:8083/getRoute?routeId=" + routeId;
        LOGGER.info("URL: " + url);
        ResponseEntity<List<Route>> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Route>>() {});
        List<Route> routes = responseEntity.getBody();
        //assert routes != null;
        if(routes != null) {
        //LOGGER.info("Route is: " + routes);
//            List<TrainingData> listOfTrainingData = new ArrayList<>();
            List<TrainingData> listOfTrainingDataTemporary = new ArrayList<>();
            for (Route route : routes) {
                LOGGER.info("Route is: " + route.toString());
                minDistanceResult minResult = checkSegment.checkSegment(route, currentVehiclePosition);
                if(minResult != null) {


                    // convert the timeStamp of vehicleInfo to ZonedDateTime object, and save this ZonedDateTime in TrainingData object
                    ZonedDateTime zonedDateTime = convertTimeStampService.convertTimeStampToZonedDateTime(vehicleInfo.getTimeStamp(), "America/New_York");

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z");
                    String formattedZonedDateTime = zonedDateTime.format(formatter);

                    // Use ObjectId.get() to generate a unique ObjectId
                    ObjectId id = ObjectId.get();
                    String hexId = id.toHexString();

                    TrainingData trainingData = new TrainingData(hexId,
                            vehicleInfo, minResult, formattedZonedDateTime
                    );
                    //trainingDataRepository.save(trainingData);
                    // add each TrainingData object into a list
                    listOfTrainingData.add(trainingData);
                    //---------
                    listOfTrainingDataTemporary.add(trainingData);
                    String vehicleToJsonString = convertListOfDocumentsToJson.convertDocumentsToJson(trainingData.getVehicleInfo());
                    LOGGER.info("Json String of VehicleInfo object is: " + vehicleToJsonString);

                    String minDistanceResultToJsonString = convertListOfDocumentsToJson.convertDocumentsToJson(trainingData.getMinDistanceResult());
                    LOGGER.info("Json String of minDistanceResult object is: " + minDistanceResultToJsonString);

                    String trainingDataToJsonString = convertListOfDocumentsToJson.convertDocumentsToJson(trainingData);
                    LOGGER.info("Json String of TrainingData object is: " + trainingDataToJsonString);

                    LOGGER.info("TrainingData object: " + trainingData.toString());
                    LOGGER.info("VehicleInfoEntity object: " + trainingData.getVehicleInfo().toString());
                    LOGGER.info("MinDistanceResult object: " + trainingData.getMinDistanceResult().toString());

                    writeToJsonFile.appendFile(FILE_PATH, trainingDataToJsonString);
                    listOfTrainingDataTemporary.clear();
                    //-----------
                    LOGGER.info("Training Data saved to database: " + trainingData);
                    LOGGER.info("minResult object contains segmentId on which the vehicleId {} is now on, is {}" , vehicleInfo.getVehicle().getId(), minResult.toString());
                } else {
                    LOGGER.info("minResult is null");
                }

                //writeToJsonFile.appendToFile(FILE_PATH, trainingDataListToJsonString);
                //writeToJsonFile.writeFile(FILE_PATH, trainingDataListToJsonString);
            }
        }
        else {
            LOGGER.info("routes is null");
        }}  catch (Exception e) {
        LOGGER.error("Exception during consume", e);
    }


        //-----------------------------------------------------------------------------
        //VehicleInfoEntity entity = objectMapper.readValue(vehicleInfo, VehicleInfoEntity.class);

        //vehicleInfoRepository.save(entity);
//        LOGGER.info(String.format(vehicleInfo.toString()));
        
        // the received message is in JSON format of the VehicleInfoEntity
        // But, this JSON is then deserialized into VehicleInfoEntity object (defined in the Kafka-Consumer module, not in the Kafla-Producer module), due to the property specified in application.properties in Kafka Consumer
        // insert this object into MongoDB

//        Optional<VehicleInfoEntity> existingVehicleInfoEntity = vehicleInfoRepository.findByVehicleId(vehicleInfo.getVehicle().getId());
//        if(existingVehicleInfoEntity.isPresent()) {
//            VehicleInfoEntity entity = existingVehicleInfoEntity.get();
//            if(!Objects.equals(entity.getTrip().getRoute_id(), "66") && !Objects.equals(entity.getTrip().getRoute_id(), "67")) {
//                entity.setTrip(vehicleInfo.getTrip());
//                entity.setVehicle(vehicleInfo.getVehicle());
//                entity.setPosition(vehicleInfo.getPosition());
//                entity.setTimeStamp(vehicleInfo.getTimeStamp());
//
//                vehicleInfoRepository.save(entity);
//            }
//
//        } else {
//            if(!Objects.equals(vehicleInfo.getTrip().getRoute_id(), "66") && !Objects.equals(vehicleInfo.getTrip().getRoute_id(), "67")) {
//                vehicleInfoRepository.save(vehicleInfo);
//            }
//
//        }


        // use objectMapper.writeValueAsString(): to serialize Java Object to JSON string
        //String json = objectMapper.writeValueAsString(vehicleInfo);
        // log the JSON string of the VehicleInfoEntity object, to the console
        //LOGGER.info(json);


    }

//    @PreDestroy
//    public void writeListToFile() {
//        String listOfTrainingDataJson = convertListOfDocumentsToJson.convertDocumentsToJson(listOfTrainingData);
//        LOGGER.info("Json String of List of TrainingData objects is: " + listOfTrainingDataJson);
//        writeToJsonFile.writeFile(FILE_PATH, listOfTrainingDataJson);
//        // Clear the list after writing to the file
//        //listOfTrainingData.clear();
//    }
    // Register a shutdown hook
    @Autowired
    public void registerShutdownHook() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            // Perform cleanup tasks here
            String listOfTrainingDataJson = convertListOfDocumentsToJson.convertDocumentsToJson(listOfTrainingData);
            LOGGER.info("Json String of List of TrainingData objects is: " + listOfTrainingDataJson);
            writeToJsonFile.writeFile(FILE_PATH, listOfTrainingDataJson);
            // check list's size to see if the list is automatically cleared after the program terminates
            LOGGER.info("listOfTrainingDataJson size: " + listOfTrainingData.size());
            LOGGER.info("Shutdown hook executed");
        }));
    }

//    @PreDestroy
//    public void onShutdown() {
//        // Perform cleanup tasks here
//        String listOfTrainingDataJson = convertListOfDocumentsToJson.convertDocumentsToJson(listOfTrainingData);
//        LOGGER.info("Json String of List of TrainingData objects is: " + listOfTrainingDataJson);
//        writeToJsonFile.convertContentsInFileToListOfJsonObjects(FILE_PATH);
//        // check list's size to see if the list is automatically cleared after the program terminates
//        LOGGER.info("listOfTrainingDataJson size: " + listOfTrainingData.size());
//        LOGGER.info("Shutdown hook executed");
//    }
}
