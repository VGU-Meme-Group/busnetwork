package com.project.Project;

import java.net.URL;

import com.google.transit.realtime.GtfsRealtime.FeedEntity;
import com.google.transit.realtime.GtfsRealtime.FeedMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class HandleRealTimeData {
    private static final Logger LOGGER = LoggerFactory.getLogger(HandleRealTimeData.class);

    @Scheduled(fixedRate = 3000)

    public void fetchRealTime() throws Exception {
        System.out.println("Hello World1");

        try {
            URL url = new URL("http://gtfs.gcrta.org/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb");
            System.out.println("Hello World2");
            FeedMessage feed = FeedMessage.parseFrom(url.openStream());
            for (FeedEntity entity : feed.getEntityList()) {
                if (entity.hasVehicle()) {
                    LOGGER.info(entity.getVehicle().toString());
                }
            }
        } catch (Exception e) {
            LOGGER.error("Error occurred: " + e.getMessage(), e);
        }
    }
}
