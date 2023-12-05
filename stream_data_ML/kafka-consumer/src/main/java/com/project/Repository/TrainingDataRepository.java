package com.project.Repository;

import com.mongodb.lang.NonNullApi;
import com.project.Entity.TrainingData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;


public interface TrainingDataRepository extends MongoRepository<TrainingData, String> {

    @Query("{id : '?0'}")
    Optional<TrainingData> findById(String id);
}
