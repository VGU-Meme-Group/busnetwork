package com.project.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Position {

    private double latitude;

    private double longitude;

    private double bearing;

    // set the default value for speed to be 0, if speed is missing in the realtime data
    private double speed = 0;
}
