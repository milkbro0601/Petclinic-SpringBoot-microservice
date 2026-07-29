package org.springframework.samples.petclinic.genai.dto;

public record VisitDetails(
    Integer id,
    Integer petId,
    String date,
    String description) {
}
