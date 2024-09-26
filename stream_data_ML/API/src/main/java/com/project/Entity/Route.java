package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Route {

    @Id
    private String id; // "id" must be included as a required field in MongoDB document, or else Repository returns Null

    private String routeId;

    private String routeName;

    private List<ShapeInRoute> shapes;

    @Override
    public String toString() {
        return "Route{" +
                "id='" + id + '\'' +
                ", routeId='" + routeId + '\'' +
                ", routeName='" + routeName + '\'' +
                ", shapes=" + shapes +
                '}';
    }
}
