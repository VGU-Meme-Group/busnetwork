package com.project.Service;

import com.project.Entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class CheckSegment {

    private static final Logger LOGGER = LoggerFactory.getLogger(CheckSegment.class);
    private ShapeService shapeService;
    private SegmentService segmentService;
    private MongoTemplate mongoTemplate;
    @Qualifier("apiRestTemplate")
    private RestTemplate restTemplate;
    public CheckSegment(ShapeService shapeService, SegmentService segmentService, MongoTemplate mongoTemplate, RestTemplate restTemplate) {
        this.shapeService = shapeService;
        this.segmentService = segmentService;
        this.mongoTemplate = mongoTemplate;
        this.restTemplate = restTemplate;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public minDistanceResult checkSegmentWithTransaction(Route route, Position vehiclePosition) {
        return checkSegment(route, vehiclePosition);
    }
    // Find the minDistanceResult object (contain segmentId, minDistance), which returns the segmentId of the Segment where the current position of Vehicle, compared to every point on all segments of all shapes of a Route, is the Minimum --> this is the segmenId of the Segment where the vehicle is currently on
    public minDistanceResult checkSegment(Route route, Position vehiclePosition) {

        //List<Double> minDistanceList = new ArrayList<>();
        List<minDistanceResult> minDistanceResultList = new ArrayList<>();
        // get the list of Shapes[] that belong to this Route
        List<ShapeInRoute> listOfShapesInRoute = route.getShapes();
        if (listOfShapesInRoute == null) {
            // Handle the case where the list is empty
            LOGGER.info("listOfShapesInRoute is null");
            return null;
        } else if (listOfShapesInRoute.isEmpty()) {
            LOGGER.info("listOfShapesInRoute is empty list");

        } else {
            LOGGER.info("listOfShapesInRoute is not null and empty, size: " + listOfShapesInRoute.size());
            listOfShapesInRoute.forEach(shapeInRoute -> LOGGER.info("each shapeInRoute is: " + shapeInRoute.toString()));
        }
        // traverse through each Shape object, get the list of Segments belong to this Shape
        for(ShapeInRoute shapeInRoute : listOfShapesInRoute) {
            String shapeId = shapeInRoute.getShapeId();
            LOGGER.info("shapeId is: " + shapeId);
            //List<Shape> listOfShapes = shapeService.getListOfShapesByShapeId(shapeId);
//            Query query = new Query(Criteria.where("shapeId").is(shapeId));
//            List<Shape> listOfShapes = mongoTemplate.find(query, Shape.class);
            // Call the API to get segments for a shape directly
            String apiUrl = "http://localhost:8083/getSegments/" + shapeId;
            ResponseEntity<List<Shape>> responseEntity = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Shape>>() {});

            List<Shape> listOfShapes = responseEntity.getBody();
            if (listOfShapes == null) {
                // Handle the case where the list is empty
                LOGGER.info("listOfShapes is null");
                return null;
            } else if (listOfShapes.isEmpty()) {
                LOGGER.info("listOfShapes is empty list");

            } else {
                LOGGER.info("listOfShapes is not null and empty, size: " + listOfShapes.size());
                listOfShapes.forEach(shape -> LOGGER.info("each Shape in listOfShapes is: " + shape.toString()));
            }
//            for(Shape shape : listOfShapes) {
//                LOGGER.info("Shape data: " + shape.toString());
//            }
            // get list of Segments belong to this Shape
            List<Segment> listOfSegmentsInThisShape = shapeService.getListOfSegmentsInAShape(listOfShapes);
            if (listOfSegmentsInThisShape == null) {
                // Handle the case where the list is empty
                LOGGER.info("listOfSegmentsInThisShape is null");
                //LOGGER.info("Number of shapes found: " + listOfSegmentsInThisShape.size());
                return null;
            } else if (listOfSegmentsInThisShape.isEmpty()) {
                LOGGER.info("listOfSegmentsInThisShape is empty list");

            } else {
                LOGGER.info("listOfSegmentsInThisShape is not null and empty, size: " + listOfSegmentsInThisShape.size());
                listOfSegmentsInThisShape.forEach(segment -> LOGGER.info("each segment in this shape: " + segment.toString()));

            }
//            for(Segment segment : listOfSegmentsInThisShape) {
//                if(segment != null) {
//                    LOGGER.info("Segment data: " + segment.toString());
//                } else {
//                    LOGGER.info("Segment object is null");
//                }
//
//            }
            minDistanceResult minResult = segmentService.findMinDistance(listOfSegmentsInThisShape, vehiclePosition);
            //LOGGER.info("minResult is:" + minResult.toString());
            LOGGER.info("Min Distance Result for Shape {}: {}", shapeId,  (minResult != null ? minResult.toString() : "min Distance Result is null"));
            minDistanceResultList.add(minResult);

        }
        if (minDistanceResultList == null) {
            // Handle the case where the list is empty
            LOGGER.info("minDistanceResultList is null");

            return null;
        } else if (minDistanceResultList.isEmpty()) {
            LOGGER.info("Size of minDistanceResultList is: " + minDistanceResultList.size());

        } else {
            LOGGER.info("minDistanceResultList is not null");
            LOGGER.info("Size of minDistanceResultList is: " + minDistanceResultList.size());
            minDistanceResultList.forEach(minDistanceResult -> LOGGER.info("each shape in listOfShapesByShapeId is: " + minDistanceResult.toString()));
        }
        minDistanceResult minDistanceResultAcrossAllShapes = Collections.min(minDistanceResultList, Comparator.comparingDouble(minDistanceResult::getMinDistance));
        if(minDistanceResultAcrossAllShapes != null) {
            //LOGGER.info("Min Distance Result Across All Shapes: {}", minDistanceResultAcrossAllShapes.toString());
            LOGGER.info("Min Distance Result Across All Shapes has segmentId: {}, minDistance: {}", minDistanceResultAcrossAllShapes.getSegmentId(), minDistanceResultAcrossAllShapes.getMinDistance());
        } else {
            LOGGER.info("Min Distance Result Across All Shapes is null");
        }

        return minDistanceResultAcrossAllShapes;

    }
}
