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

    private int bearing;

    private double speed = 0;
}
