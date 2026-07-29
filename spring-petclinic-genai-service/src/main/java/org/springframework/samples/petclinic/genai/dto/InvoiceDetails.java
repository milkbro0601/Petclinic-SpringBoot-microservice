package org.springframework.samples.petclinic.genai.dto;

import java.math.BigDecimal;
import java.util.List;

public record InvoiceDetails(Integer id, Integer visitId, Integer petId, Integer ownerId,
                             String invoiceDate, BigDecimal totalAmount, InvoiceStatus status,
                             List<InvoiceTreatmentDetails> treatments, List<InvoiceMedicineDetails> medicines) {
}
