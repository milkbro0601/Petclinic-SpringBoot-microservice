package org.springframework.samples.petclinic.genai.dto;

import java.math.BigDecimal;

public record TreatmentDetails(Integer id, String name, String description, BigDecimal price) {
}
