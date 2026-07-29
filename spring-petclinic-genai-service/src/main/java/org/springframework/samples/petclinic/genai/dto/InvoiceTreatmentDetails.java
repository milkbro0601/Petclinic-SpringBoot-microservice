package org.springframework.samples.petclinic.genai.dto;

import java.math.BigDecimal;

public record InvoiceTreatmentDetails(Integer id, Integer treatmentId, String treatmentName, Integer quantity, BigDecimal unitPrice, BigDecimal subtotal){
}
