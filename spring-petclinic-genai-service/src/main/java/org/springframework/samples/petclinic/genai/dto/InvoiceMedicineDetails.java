package org.springframework.samples.petclinic.genai.dto;

import java.math.BigDecimal;

public record InvoiceMedicineDetails(Integer id, Integer medicineId, String medicineName,
                                     Integer quantity, BigDecimal unitPrice, BigDecimal subtotal) {
}
