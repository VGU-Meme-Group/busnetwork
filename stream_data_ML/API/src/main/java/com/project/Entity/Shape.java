package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "shapes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Shape {

    @Id
    private String id;

    private String shapeId;

    private List<Segment> segments;

    private int __v = 0;

    @Override
    public String toString() {
        return "Shape{" +
                "id='" + id + '\'' +
                ", shapeId='" + shapeId + '\'' +
                ", segments=" + segments +
                ", __v=" + __v +
                '}';
    }
}
