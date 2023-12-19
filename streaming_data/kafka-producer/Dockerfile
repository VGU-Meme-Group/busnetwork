FROM openjdk:17-jdk

WORKDIR /app

COPY target/kafka-producer-0.0.1-SNAPSHOT.jar /app/kafka-producer-0.0.1-SNAPSHOT.jar

EXPOSE 8081

CMD ["java", "-jar", "kafka-producer-0.0.1-SNAPSHOT.jar"]