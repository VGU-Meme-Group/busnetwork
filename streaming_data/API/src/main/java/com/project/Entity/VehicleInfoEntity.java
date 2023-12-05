package com.project.Entity;



import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleInfoEntity {

    @Id
    private String id; // use String id, because we want the id in the log message to be in hexString

    private Trip trip;

    private Vehicle vehicle;

    private Position position;

    private long timeStamp;


}


