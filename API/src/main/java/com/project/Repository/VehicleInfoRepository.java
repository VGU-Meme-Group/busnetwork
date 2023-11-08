package com.project.Repository;

import com.project.Entity.VehicleInfoEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VehicleInfoRepository extends MongoRepository<VehicleInfoEntity, String> {

    List<VehicleInfoEntity> findByTimeStampBefore(long timeStamp);
}
