package com.project.Service;

import com.project.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ConvertTimeStampService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConvertTimeStampService.class);
    public ZonedDateTime convertTimeStampToZonedDateTime(long timeStamp, String timeZone) {

        // Convert timestamp to ZonedDateTime in a specific time zone (e.g., America/New_York)
        //String timeZone = "America/New_York";
        ZoneId zoneId = ZoneId.of(timeZone);
        // create a ZonedDateTime for the timeStamp (in "seconds"), of this zoneId
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(Instant.ofEpochSecond(timeStamp), zoneId);
        // format the ZonedDateTime object to a String
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z");
        String formattedZonedDateTime = zonedDateTime.format(formatter);
        LOGGER.info("Current ZonedDateTime: " + formattedZonedDateTime);
        return zonedDateTime;

    }
}
