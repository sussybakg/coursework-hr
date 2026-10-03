FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /coursework-backend

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /coursework-backend

COPY --from=build /coursework-backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
