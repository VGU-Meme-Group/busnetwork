package com.project.Entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    private String id;
    private String label;

    @Override
    public String toString() {
        return "Vehicle{" +
                "id='" + id + '\'' +
                ", label='" + label + '\'' +
                '}';
    }
}

