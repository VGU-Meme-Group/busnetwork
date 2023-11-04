package com.project.Service;

import com.project.Entity.VehicleInfoEntity;
import com.project.Repository.VehicleInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleInfoService {

    @Autowired
    private VehicleInfoRepository vehicleInfoRepository;

    public List<VehicleInfoEntity> getAllDocuments() {
        return vehicleInfoRepository.findAll();
    }
}
