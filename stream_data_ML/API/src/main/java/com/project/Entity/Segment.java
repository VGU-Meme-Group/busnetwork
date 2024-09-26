package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Segment {

//    @Id
//    private String id;

    private String segmentId;

    @Field("stop_src")
    private SegmentStopSrc stop_src;

    @Field("stop_dest")
    private SegmentStopDest stop_dest;

    @Id
    private String id;

    @Override
    public String toString() {
        return "Segment{" +
                "id='" + id + '\'' +
                ", segmentId='" + segmentId + '\'' +
                ", stop_src=" + stop_src.toString() +
                ", stop_dest=" + stop_dest.toString() +
                '}';
    }
}
