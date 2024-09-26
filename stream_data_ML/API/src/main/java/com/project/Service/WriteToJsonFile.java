package com.project.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class WriteToJsonFile {

    private static final Logger LOGGER = LoggerFactory.getLogger(WriteToJsonFile.class);
    public void appendFile(String filePath, String data) {
        try {
            // Check if the file exists, and create it if it doesn't
            if (!Files.exists(Paths.get(filePath))) {
                Files.createFile(Paths.get(filePath));
            }

            try (FileWriter fileWriter = new FileWriter(filePath, true)) {
                fileWriter.write(data);
                fileWriter.write(System.lineSeparator());  // Add a newline to separate objects
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // function to read each line of a file, and add each line (which is a String representation of JSON object) into a List<String>
    // return this List<String> containing all String objects on each line of the file
    public List<String> readLinesFromFile(String filePath) {
        List<String> listOfObjectsInJsonString = new ArrayList<>();
        LOGGER.info("readLinesFromFile is called...");
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String objectInJsonString;
            while ((objectInJsonString = reader.readLine()) != null) {
                LOGGER.info("object in json String before if: " + objectInJsonString);
                // if a line contains a String representation of a List<String> --> this is the old List<String> that we got after terminating the program
                if(isListJson(objectInJsonString)) {
                    LOGGER.info("isListJson is: " + isListJson(objectInJsonString));
                    LOGGER.info("object in json String in if: " + objectInJsonString);
                    // convert this already-existing String representation of List<String> --> List<String>
                    List<String> parsedListOfString = convertStringOfListtoListOfString(objectInJsonString);
                    // add all of the String inside this List<String>, to the listOfObjectsInJsonString List<String>, which is the result List<String>
                    listOfObjectsInJsonString.addAll(parsedListOfString);
                } else {
                    LOGGER.info("isListJson is: " + isListJson(objectInJsonString));
                    // if this current line does not contain a String representation of List<String>
                    // --> just add this String object to the result List, as normally
                    LOGGER.info("object in json String in else: " + objectInJsonString);
                    listOfObjectsInJsonString.add(objectInJsonString);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        listOfObjectsInJsonString.forEach(item -> LOGGER.info("each item: " + item));
        return listOfObjectsInJsonString;
    }

    // 1. readLinesFromFile(String filePath): read the file's contents, line by line, and add to a List<String>
    // 2. convertContentsInFileToListOfJsonObjects(String filePath): convert this List<String> --> String representation of a List, then write to this file
    public void convertContentsInFileToListOfJsonObjects(String filePath) {

        ObjectMapper objectMapper = new ObjectMapper();
        try (FileWriter fileWriter = new FileWriter(filePath)) {

            List<String> listOfObjectsInJsonString = readLinesFromFile(filePath);
            LOGGER.info("listOfObjectsInJsonString" + listOfObjectsInJsonString);

            for (String line : listOfObjectsInJsonString) {
                LOGGER.info("Processing line: " + line);
                if (isListJson(line)) {
                    LOGGER.info("Line is a JSON array");
                    List<String> parsedListOfString = convertStringOfListtoListOfString(line);
                    LOGGER.info("Parsed list: " + parsedListOfString);
                    // add all of the String inside this List<String>, to the listOfObjectsInJsonString List<String>, which is the result List<String>
                    listOfObjectsInJsonString.addAll(parsedListOfString);
                } else {
                    LOGGER.info("Line is not a JSON array");
                }
            }
            // convert listOfObjectsInJsonString to a String (List<String> --> String of a List)
            String jsonList = objectMapper.writeValueAsString(listOfObjectsInJsonString);
            LOGGER.info("jsonList: " + jsonList);
            fileWriter.write(jsonList);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void writeFile(String filePath, String data) {
        try (FileWriter fileWriter = new FileWriter(filePath)) {
            fileWriter.write(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Check if a given string represents a JSON array (List<String>)
    private boolean isListJson(String input) {
        return input.trim().startsWith("[") && input.trim().endsWith("]");
    }

    // function to parse/convert a String representation of a List<String> into a List<String>
    private List<String>  convertStringOfListtoListOfString(String jsonList) {
        // extract the square bracket [] of the String representation of the jsonList, to get only the String inside
       try {
           jsonList = jsonList.substring(1, jsonList.length() - 1);
           // split each String object by comma ",", to get an array of String objects
           String[] listOfStringObjects = jsonList.split(",");

           List<String> result = new ArrayList<>();
           // convert the array of String, into a List<String>, and add each String element into the result List<String>
           Arrays.asList(listOfStringObjects).forEach(result::add);
           return result;
       } catch (Exception e) {
           LOGGER.error("Error converting JSON array string to list", e);
           return new ArrayList<>();
       }

    }
}
