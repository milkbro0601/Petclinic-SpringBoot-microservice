package org.springframework.samples.petclinic.genai.dto;

import java.util.Set;

public record Vet(
    Integer id,
    String firstName,
    String lastName,
    Set<Specialty> specialties) {
}
