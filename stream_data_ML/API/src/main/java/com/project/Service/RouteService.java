package com.project.Service;

import com.project.Entity.Route;
import com.project.Repository.RouteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {

    private RouteRepository routeRepository;
    private static final Logger logger = LoggerFactory.getLogger(RouteService.class);

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<Route> getListOfRoutesByRouteId(String routeId) {
        List<Route> listOfRoutesByRouteId = routeRepository.findByRouteId(routeId);
        logger.info("Route found in service: " + listOfRoutesByRouteId);
        return listOfRoutesByRouteId;
    }
}
