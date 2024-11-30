FROM bellsoft/liberica-openjre-alpine:11
WORKDIR /app
VOLUME /tmp
COPY target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar /app/app.jar"]