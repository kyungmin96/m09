# Amazon Corretto 17 사용 (Java 17 버전)
FROM amazoncorretto:17

# Set the working directory
WORKDIR /app/m09

# Copy the project files into the container
COPY ./m09 ./

# Gradle 실행 권한 부여
RUN chmod +x ./gradlew

# Gradle 빌드 (테스트 제외)
RUN ./gradlew build -x test

# 환경 변수 설정 (MySQL)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://172.26.5.210:3306/m09
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=root

# EXPOSE 8080

# JAR 파일을 실행
CMD ["java", "-jar", "build/libs/m09-0.0.1-SNAPSHOT.jar"]