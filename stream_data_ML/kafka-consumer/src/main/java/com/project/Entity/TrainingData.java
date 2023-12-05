package com.project.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Document(collection = "training_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//@JsonIgnoreProperties("id")
public class TrainingData {

    @Id
    //@JsonIgnore
    private String id;

    private VehicleInfoEntity vehicleInfo;

    private minDistanceResult minDistanceResult;

    //@Field(targetType = FieldType.STRING)
    //private ZonedDateTime zonedDateTime;

    private String formattedZonedDateTime;

    public TrainingData(VehicleInfoEntity vehicleInfo, com.project.Entity.minDistanceResult minDistanceResult, String formattedZonedDateTime) {
        this.vehicleInfo = vehicleInfo;
        this.minDistanceResult = minDistanceResult;
        this.formattedZonedDateTime = formattedZonedDateTime;
    }

//    public String getFormattedZonedDateTime() {
//        // Customize the format as per your requirements
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z");
//        return zonedDateTime.format(formatter);
//    }
    @Override
    public String toString() {
        return "TrainingData{" +
                "id='" + id + '\'' +
                ", vehicleInfo=" + vehicleInfo +
                ", minDistanceResult=" + minDistanceResult +
                ", zonedDateTime=" + formattedZonedDateTime +
                '}';
    }
}
