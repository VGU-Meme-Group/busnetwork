package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

//@Document(collection = "vehicle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleInfoEntity {

    @Id
    //@Field("id")
    private String id; // use String id, so that Kafka Producer can store the hexString of the id in its object

    private Trip trip;

    private Vehicle vehicle;

    private Position position;

    private long timeStamp;


}
