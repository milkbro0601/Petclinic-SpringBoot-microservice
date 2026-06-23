package org.springframework.samples.petclinic.invoice.web;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.samples.petclinic.invoice.exception.ResourceNotFoundException;
import org.springframework.samples.petclinic.invoice.model.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceResource {

    private static final Logger log = LoggerFactory.getLogger(InvoiceResource.class);
    private final InvoiceRepository invoiceRepository;

    @GetMapping
    public List<Invoice> getAllInvoices() {
        log.info("Request to get all invoices");
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Invoice getInvoiceById(@PathVariable int id) {
        log.info("Request to get invoice with id: {}", id);
        return invoiceRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Invoice with id {} not found", id);
                return new ResourceNotFoundException("Invoice " + id + " not found");
            });
    }

    @GetMapping("/visit/{visitId}")
    public List<Invoice> getInvoicesByVisit(@PathVariable int visitId) {
        log.info("Request to get invoices for visitId: {}", visitId);
        return invoiceRepository.findByVisitId(visitId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Invoice> getInvoicesByOwner(@PathVariable int ownerId) {
        log.info("Request to get invoices for ownerId: {}", ownerId);
        return invoiceRepository.findByOwnerId(ownerId);
    }

    @GetMapping("/pet/{petId}")
    public List<Invoice> getInvoicesByPet(@PathVariable int petId) {
        log.info("Request to get invoices for petId: {}", petId);
        return invoiceRepository.findByPetId(petId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Invoice createInvoice(@Valid @RequestBody Invoice invoice) {
        log.info("Request to create invoice for visitId: {}", invoice.getVisitId());

        // calculate subtotals for treatments
        invoice.getTreatments().forEach(t -> {
            t.setInvoice(invoice);
            t.calculateSubtotal();
        });

        // calculate subtotals for medicines
        invoice.getMedicines().forEach(m -> {
            m.setInvoice(invoice);
            m.calculateSubtotal();
        });

        // calculate total
        invoice.calculateTotal();

        Invoice saved = invoiceRepository.save(invoice);
        log.info("Invoice saved successfully with id: {}", saved.getId());
        return saved;
    }

    @PutMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateInvoiceStatus(
        @PathVariable int id,
        @RequestParam InvoiceStatus status) {

        log.info("Request to update invoice {} status to {}", id, status);
        Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Invoice with id {} not found for status update", id);
                return new ResourceNotFoundException("Invoice " + id + " not found");
            });
        invoice.setStatus(status);
        invoiceRepository.save(invoice);
        log.info("Invoice {} status updated to {}", id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable int id) {
        log.info("Request to delete invoice with id: {}", id);
        invoiceRepository.findById(id)
            .orElseThrow(() -> {
                log.warn("Invoice with id {} not found for delete", id);
                return new ResourceNotFoundException("Invoice " + id + " not found");
            });
        invoiceRepository.deleteById(id);
        log.info("Invoice deleted successfully with id: {}", id);
    }
}
