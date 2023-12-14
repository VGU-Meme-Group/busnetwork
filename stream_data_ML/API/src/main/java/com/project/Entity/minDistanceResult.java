package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class minDistanceResult {

    private String segmentId;

    // the SMALLER Distance between the current Position of Vehicle, and a point on ONE SEGMENT
    private double minDistance;

    @Override
    public String toString() {
        return "minDistanceResult{" +
                "segmentId='" + segmentId + '\'' +
                ", minDistance=" + minDistance +
                '}';
    }
}
