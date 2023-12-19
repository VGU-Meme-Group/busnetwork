FROM openjdk:17-jdk

WORKDIR /app

COPY target/kafka-consumer-0.0.1-SNAPSHOT.jar /app/kafka-consumer-0.0.1-SNAPSHOT.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "kafka-consumer-0.0.1-SNAPSHOT.jar"]