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

    @Value("${visits.service.url:http://localhost:8080/api/visit}")
    private String visitsServiceUrl;

    public VisitClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<VisitResponse> getAllVisits() {
        try {
            String url = visitsServiceUrl + "/pets/visits?petId=1,2,3,4,5,6,7,8,9,10";
            log.info("Fetching all visits from visits-service at {}", url);
            VisitsResponse response = restTemplate.getForObject(url, VisitsResponse.class);
            List<VisitResponse> visits = response != null ? response.items() : new ArrayList<>();
            log.info("Fetched {} visits", visits.size());
            return visits;
        } catch (Exception e) {
            log.error("Error fetching visits: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    private record VisitsResponse(List<VisitResponse> items) {
    }
}
