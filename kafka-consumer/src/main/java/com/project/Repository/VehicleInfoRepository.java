package com.project.Repository;

import com.project.Entity.VehicleInfoEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VehicleInfoRepository extends MongoRepository<VehicleInfoEntity, ObjectId> {
}
