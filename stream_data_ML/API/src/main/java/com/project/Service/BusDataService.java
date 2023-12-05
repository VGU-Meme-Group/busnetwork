package com.project.Service;

import com.project.Entity.VehicleInfoEntity;
import com.project.Repository.VehicleInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusDataService {

    @Autowired
    private VehicleInfoRepository vehicleInfoRepository;

    public List<VehicleInfoEntity> returnBusDataLessThanOneHour() {
        long timestampToDeleteBefore = System.currentTimeMillis() - (3600 * 1000); // Delete data older than 1 hour (in milliseconds)
        return vehicleInfoRepository.findByTimeStampBefore(timestampToDeleteBefore);
    }

    public void deleteBusDataLessThanOneHour() {
        long timestampToDeleteBefore = System.currentTimeMillis() - (3600 * 1000);
        vehicleInfoRepository.deleteByTimeStampBefore(timestampToDeleteBefore);
    }

    public VehicleInfoEntity getLatestBusData(String vehicleId) {
        return vehicleInfoRepository.findTopByVehicleIdOrderByTimeStampDesc(vehicleId);
    }

    public List<VehicleInfoEntity> getAllBusData() {
        return vehicleInfoRepository.findAll();
    }
}
