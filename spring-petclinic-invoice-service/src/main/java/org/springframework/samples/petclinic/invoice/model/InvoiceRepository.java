package org.springframework.samples.petclinic.invoice.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByVisitId(Integer visitId);
    List<Invoice> findByOwnerId(Integer ownerId);
    List<Invoice> findByPetId(Integer petId);
    List<Invoice> findByStatus(InvoiceStatus status);
}
