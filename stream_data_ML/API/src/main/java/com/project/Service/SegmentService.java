package com.project.Service;

import com.project.Entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class SegmentService {

    private FindDistanceService findDistanceService;
    private static final Logger LOGGER = LoggerFactory.getLogger(SegmentService.class);

    public SegmentService(FindDistanceService findDistanceService) {
        this.findDistanceService = findDistanceService;
    }

    // Find the minDistanceResult object (segmentId, minDistance) that has the current position of vehicle, to a particular point on a Segment
    public minDistanceResult findMinDistance(List<Segment> listOfSegments, Position vehiclePosition) {
        //List<Double> minDistanceList = new ArrayList<>();
        if (listOfSegments == null || listOfSegments.isEmpty()) {
            // Handle the case where the list is empty
            LOGGER.info("listOfSegments is null");
            return null;
        }
        minDistanceResult minResult = null;
        double minDistance = Double.MAX_VALUE;
        //List<minDistanceResult> minDistanceResultList = new ArrayList<>();
        for(Segment segment : listOfSegments) {
            String segmentId = segment.getSegmentId();
            SegmentStopSrc stopSrc = segment.getStop_src();
            SegmentStopDest stopDest = segment.getStop_dest();

            double distance_1 = findDistanceService.findDistance(vehiclePosition, stopSrc);
            double distance_2 = findDistanceService.findDistance(vehiclePosition, stopDest);
            double minSegmentDistance = Math.min(distance_1, distance_2);
            if (minSegmentDistance < minDistance) {
                minDistance = minSegmentDistance;
                minResult = new minDistanceResult(segment.getSegmentId(), minDistance);
            }
            //minDistanceResultList.add(new minDistanceResult(segmentId, minDistance));
        }
        //minDistanceResult minResult = Collections.min(minDistanceResultList, Comparator.comparingDouble(minDistanceResult::getMinDistance));
        return minResult;
    }
}
