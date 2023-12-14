package com.project.Controller;

import com.project.Entity.Route;
import com.project.Entity.Shape;
import com.project.Entity.VehicleInfoEntity;
import com.project.Service.RouteService;
import com.project.Service.ShapeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8082/")
public class BackendController {

    private RouteService routeService;

    private ShapeService shapeService;
    private static final Logger logger = LoggerFactory.getLogger(BackendController.class);

    public BackendController(RouteService routeService, ShapeService shapeService) {
        this.routeService = routeService;
        this.shapeService = shapeService;
    }

    @GetMapping("/getRoute")
    public ResponseEntity<List<Route>> getListOfRoutesByRouteId(@RequestParam("routeId") String routeId) {
        logger.info("Request received for routeId: {}", routeId);
        List<Route> routes = routeService.getListOfRoutesByRouteId(routeId);
        logger.info("Route found: {}", routes);
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/getSegments/{shapeId}")
    public ResponseEntity<List<Shape>> getListOfShapesByShapeId(@PathVariable("shapeId") String shapeId) {
        List<Shape> shapes = shapeService.getListOfShapesByShapeId(shapeId);
        if(shapes == null || shapes.isEmpty()) {
            logger.info("shapes list is null");
        } else {
            logger.info("shapes list is not null");
            logger.info("shapes list size: " + shapes.size());
            shapes.forEach(shape -> logger.info("each shape is: " + shape.toString()));
        }
        return ResponseEntity.ok(shapes);
    }
}
