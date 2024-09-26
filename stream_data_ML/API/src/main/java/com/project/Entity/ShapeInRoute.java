package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShapeInRoute {

    private String shapeId;

    //private List<Segment> segments;

    private String headSign;

    @Override
    public String toString() {
        return "ShapeInRoute{" +
                "shapeId='" + shapeId + '\'' +
                ", headSign='" + headSign + '\'' +
                '}';
    }

    //    public Shape(String shapeId, String headSign) {
//        this.shapeId = shapeId;
//        this.headSign = headSign;
//    }
//
//    public Shape(String shapeId, List<Segment> segments) {
//        this.shapeId = shapeId;
//        this.segments = segments;
//    }
}
