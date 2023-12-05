package com.project.Service;


import com.project.KafkaConsumer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import  org.assertj.core.api.Assertions;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

//@SpringBootTest(classes = TestConfig.class)
@SpringBootTest(classes = {ConvertTimeStampService.class, ConvertTimeStampServiceTest.class})
class ConvertTimeStampServiceTest {

    @Autowired
    private ConvertTimeStampService convertTimeStampService;

//    @MockBean
//    private KafkaConsumer kafkaConsumer;  // Mock the KafkaConsumer bean
    @Test
    void convertTimeStampServiceTest() {

        long timeStamp = 1701612808L;
        String timeZone = "America/New_York";
        ZoneId zoneIdExpected = ZoneId.of(timeZone);
        String formattedZonedDateTimeExpected ="2023-12-03 09:13:28 -0500";

        ZonedDateTime result = convertTimeStampService.convertTimeStampToZonedDateTime(timeStamp, timeZone);
        ZoneId zoneIdResult = result.getZone();

        assertEquals(zoneIdExpected, zoneIdResult);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z");
        String formattedZonedDateTimeResult = result.format(formatter);

       Assertions.assertThat(formattedZonedDateTimeResult).isEqualTo(formattedZonedDateTimeExpected);

    }

}