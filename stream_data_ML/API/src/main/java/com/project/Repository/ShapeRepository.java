package com.project.Repository;

import com.project.Entity.Shape;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ShapeRepository extends MongoRepository<Shape, String> {

//    @Query("{shapeId : '?0'}")
//    List<Shape> findByShapeId(String shapeId);
List<Shape> findByShapeIdEquals(String shapeId);
}
