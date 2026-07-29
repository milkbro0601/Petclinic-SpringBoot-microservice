package org.springframework.samples.petclinic.genai.dto;

import java.math.BigDecimal;

public record MedicineDetails(Integer id, String name, String description, String unit, BigDecimal price) {
}
