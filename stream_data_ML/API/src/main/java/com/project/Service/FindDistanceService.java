package com.project.Service;

import com.project.Entity.Position;
import com.project.Entity.SegmentStopDest;
import com.project.Entity.SegmentStopSrc;
import org.springframework.stereotype.Service;

@Service
public class FindDistanceService {

    // Earth's Radius in meters
    private static final double EARTH_RADIUS = 6371000;

    // Haversine formula to find distance between 2 Coordinates
    double haversine(double val) {
        return Math.pow(Math.sin(val / 2), 2);
    }

    // Method Overloading
    public double findDistance(Position vehiclePosition, SegmentStopSrc stopSrc) {

        double vehiclePositionLat = vehiclePosition.getLatitude();
        double vehiclePositionLon = vehiclePosition.getLongitude();

        double stopSrcLat = stopSrc.getStopLat();
        double stopSrcLon = stopSrc.getStopLon();

        // find the difference between 2 points, in terms of Latitude, and Longitude, and convert each difference from "degree" to "radian"
        double differenceInLat = Math.toRadians((vehiclePositionLat - stopSrcLat));
        double differenceInLon = Math.toRadians((vehiclePositionLon - stopSrcLon));

        // convert the Latitude of each point from "degree" to "radian"
        vehiclePositionLat = Math.toRadians(vehiclePositionLat);
        stopSrcLat = Math.toRadians(stopSrcLat);

        double a = haversine(differenceInLat) + Math.cos(vehiclePositionLat) * Math.cos(stopSrcLat) * haversine(differenceInLon);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;

//        double x = Math.pow(vehiclePositionLat - stopDestLat, 2);
//        double y = Math.pow(vehiclePositionLon - stopDestLon, 2);
//
//        double distance = Math.sqrt(x + y);
//        return distance;
    }

    public double findDistance(Position vehiclePosition, SegmentStopDest stopDest) {

        double vehiclePositionLat = vehiclePosition.getLatitude();
        double vehiclePositionLon = vehiclePosition.getLongitude();

        double stopDestLat = stopDest.getStopLat();
        double stopDestLon = stopDest.getStopLon();

        // find the difference between 2 points, in terms of Latitude, and Longitude, and convert each difference from "degree" to "radian"
        double differenceInLat = Math.toRadians((vehiclePositionLat - stopDestLat));
        double differenceInLon = Math.toRadians((vehiclePositionLon - stopDestLon));

        // convert the Latitude of each point from "degree" to "radian"
        vehiclePositionLat = Math.toRadians(vehiclePositionLat);
        stopDestLat = Math.toRadians(stopDestLat);

        double a = haversine(differenceInLat) + Math.cos(vehiclePositionLat) * Math.cos(stopDestLat) * haversine(differenceInLon);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;


    }
}
