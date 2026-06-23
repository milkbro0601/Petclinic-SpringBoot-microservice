package org.springframework.samples.petclinic.report.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.report.model.VisitResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class VisitClient {

    private static final Logger log = LoggerFactory.getLogger(VisitClient.class);

    private final RestTemplate restTemplate;

    @Value("${visits.service.url:http://localhost:8082}")
    private String visitsServiceUrl;

    public VisitClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<VisitResponse> getAllVisits() {
        try {
            log.info("Fetching all visits from visits-service");
            ResponseEntity<List<VisitResponse>> response = restTemplate.exchange(
                visitsServiceUrl + "/visits",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<VisitResponse>>() {}
            );
            List<VisitResponse> visits = response.getBody();
            log.info("Fetched {} visits from visits-service", visits != null ? visits.size() : 0);
            return visits != null ? visits : new ArrayList<>();
        } catch (Exception e) {
            log.error("Error fetching visits from visits-service: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
}
