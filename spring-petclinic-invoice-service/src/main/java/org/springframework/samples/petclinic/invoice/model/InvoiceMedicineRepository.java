package org.springframework.samples.petclinic.invoice.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceMedicineRepository extends JpaRepository<InvoiceMedicine, Integer> {
    List<InvoiceMedicine> findByInvoiceId(Integer invoiceId);
}
