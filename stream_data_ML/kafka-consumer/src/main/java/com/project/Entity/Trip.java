package com.project.Entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    private String trip_id;

    private String route_id;

    private int direction_id;

    private String start_date;

    @Override
    public String toString() {
        return "Trip{" +
                "trip_id='" + trip_id + '\'' +
                ", route_id='" + route_id + '\'' +
                ", direction_id=" + direction_id +
                ", start_date='" + start_date + '\'' +
                '}';
    }
}

