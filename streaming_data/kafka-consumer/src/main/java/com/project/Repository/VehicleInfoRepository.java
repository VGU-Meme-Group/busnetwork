package com.project.Repository;

import com.project.Entity.VehicleInfoEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VehicleInfoRepository extends MongoRepository<VehicleInfoEntity, String> {
    Optional<VehicleInfoEntity> findByVehicleId(String id);

}
