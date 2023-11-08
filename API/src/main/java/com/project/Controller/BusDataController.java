package com.project.Controller;

import com.project.Entity.VehicleInfoEntity;
import com.project.Service.BusDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
}
