package com.project.Controller;

import com.project.Entity.VehicleInfoEntity;
import com.project.Service.BusDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BusDataController {

    @Autowired
    private BusDataService busDataService;

    @GetMapping("/listBusData")
    public List<VehicleInfoEntity> listBusData() {
        return busDataService.returnBusDataLessThanOneHour();
    }

    @DeleteMapping("/deleteBusData")
    public ResponseEntity<String> deleteBusData() {
        busDataService.deleteBusDataLessThanOneHour();
        // If the deletion is successful, return an "OK" response
        return ResponseEntity.ok("Deletion was successful");
    }

    @GetMapping("/getLatestBusData")
    public VehicleInfoEntity getLatestBusData(@RequestParam String vehicleId) {
        return busDataService.getLatestBusData(vehicleId);
    }

    @GetMapping("/getAllBusData")
    public List<VehicleInfoEntity> getAllBusData() {
        return busDataService.getAllBusData();
    }
}
