./mvnw spring-boot:run -pl spring-petclinic-config-server &
sleep 30

./mvnw spring-boot:run -pl spring-petclinic-discovery-server &
sleep 20


./mvnw spring-boot:run -pl spring-petclinic-customers-service -Dspring-boot.run.jvmArguments="-Dserver.port=8081" &
./mvnw spring-boot:run -pl spring-petclinic-visits-service -Dspring-boot.run.jvmArguments="-Dserver.port=8082" &
./mvnw spring-boot:run -pl spring-petclinic-vets-service -Dspring-boot.run.jvmArguments="-Dserver.port=8083" &
./mvnw spring-boot:run -pl spring-petclinic-treatment-service -Dspring-boot.run.jvmArguments="-Dserver.port=8085" &
./mvnw spring-boot:run -pl spring-petclinic-invoice-service -Dspring-boot.run.jvmArguments="-Dserver.port=8086" &
./mvnw spring-boot:run -pl spring-petclinic-report-service -Dspring-boot.run.jvmArguments="-Dserver.port=8087" &
./mvnw spring-boot:run -pl spring-petclinic-api-gateway &
./mvnw spring-boot:run -pl spring-petclinic-genai-service -Dspring-boot.run.jvmArguments="-Dserver.port=8084"

#check port is free
lsof -i :8888

#kill server port running
kill -9 $(lsof -t -i :8888)
