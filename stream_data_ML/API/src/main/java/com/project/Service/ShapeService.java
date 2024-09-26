package com.project.Service;

import com.project.Entity.Segment;
import com.project.Entity.Shape;
import com.project.Repository.ShapeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShapeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ShapeService.class);
    private ShapeRepository shapeRepository;

    public ShapeService(ShapeRepository shapeRepository) {
        this.shapeRepository = shapeRepository;
    }

    public List<Shape> getListOfShapesByShapeId(String shapeId) {
        LOGGER.info("ShapeId received in service: " + shapeId);
        shapeId = shapeId.trim(); // Remove leading/trailing spaces
        List<Shape> listOfShapesByShapeId = shapeRepository.findByShapeIdEquals(shapeId);
        if (listOfShapesByShapeId == null) {
            // Handle the case where the list is empty
            LOGGER.info("listOfShapesId is null");

            return null;
        } else if (listOfShapesByShapeId.isEmpty()) {
            LOGGER.info("Number of shapes found: " + listOfShapesByShapeId.size());

        } else {
            LOGGER.info("listOfShapesByShapeId is not null");
            LOGGER.info("Number of shapes found: " + listOfShapesByShapeId.size());
            listOfShapesByShapeId.forEach(shape -> LOGGER.info("each shape in listOfShapesByShapeId is: " + shape.toString()));
        }

//        for(Shape shape : listOfShapesByShapeId) {
//            if(shape != null) {
//                LOGGER.info("Shape: " + shape.toString());
//            } else {
//                LOGGER.info("Shape is null");
//            }
//
//        }
        return listOfShapesByShapeId;
    }

    public List<Segment> getListOfSegmentsInAShape(List<Shape> listOfShapes) {
        if (listOfShapes == null || listOfShapes.isEmpty()) {
            // Handle the case where the list is empty
            LOGGER.info("listOfShapes is null");
            return null;
        }
        List<Segment> listOfSegmentsInThisShape = new ArrayList<>();
        for(Shape shape : listOfShapes) {
            List<Segment> allSegments = shape.getSegments();
            listOfSegmentsInThisShape.addAll(allSegments);
            LOGGER.info("shapeId in shapeService: " + shape.getShapeId());
            // Log information about each segment
            LOGGER.info("Segments in Shape {}: {}", shape.getShapeId(),
                    allSegments.stream().map(Segment::getSegmentId).collect(Collectors.toList()));
        }
        return listOfSegmentsInThisShape;
    }
}
