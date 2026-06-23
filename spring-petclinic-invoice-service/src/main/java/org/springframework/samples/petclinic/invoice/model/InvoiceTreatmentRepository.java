package org.springframework.samples.petclinic.invoice.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceTreatmentRepository extends JpaRepository<InvoiceTreatment, Integer> {
    List<InvoiceTreatment> findByInvoiceId(Integer invoiceId);
}
