package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SegmentStopSrc {

    @Field("stop_lat")
    private double stopLat;

    @Field("stop_lon")
    private double stopLon;

    @Override
    public String toString() {
        return "SegmentStopSrc{" +
                "stopLat=" + stopLat +
                ", stopLon=" + stopLon +
                '}';
    }
}
