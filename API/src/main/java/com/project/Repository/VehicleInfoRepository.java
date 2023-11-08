package com.project.Repository;

import com.project.Entity.VehicleInfoEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface VehicleInfoRepository extends MongoRepository<VehicleInfoEntity, String> {

    List<VehicleInfoEntity> findByTimeStampBefore(long timeStamp);

    void deleteByTimeStampBefore(long timeStamp);

    @Query("{'vehicle.id' : ?0}")
    public List<VehicleInfoEntity> findByVehicleId(String vehicleId);

    @Query("{'vehicle.id' : ?0}")
    VehicleInfoEntity findTopByVehicleIdOrderByTimeStampDesc(String vehicleId);
}
