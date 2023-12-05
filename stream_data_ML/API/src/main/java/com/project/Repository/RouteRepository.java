package com.project.Repository;

import com.project.Entity.Route;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RouteRepository extends MongoRepository<Route, String> {

    List<Route> findByRouteId(String routeId);
}
