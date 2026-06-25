package org.springframework.samples.petclinic.invoice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Visit ID cannot be null")
    @Min(value = 1, message = "Visit ID must be valid")
    @Column(name = "visit_id")
    private Integer visitId;

    @NotNull(message = "Pet ID cannot be null")
    @Min(value = 1, message = "Pet ID must be valid")
    @Column(name = "pet_id")
    private Integer petId;

    @NotNull(message = "Owner ID cannot be null")
    @Min(value = 1, message = "Owner ID must be valid")
    @Column(name = "owner_id")
    private Integer ownerId;

    @Builder.Default
    @Column(name = "invoice_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date invoiceDate = new Date();

    @Builder.Default
    @Column(name = "total_amount")
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InvoiceStatus status = InvoiceStatus.PENDING;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "invoice", fetch = FetchType.EAGER)
    private List<InvoiceTreatment> treatments = new ArrayList<>();

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "invoice", fetch = FetchType.EAGER)
    private List<InvoiceMedicine> medicines = new ArrayList<>();

    public void calculateTotal() {
        BigDecimal treatmentTotal = treatments.stream()
            .map(InvoiceTreatment::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal medicineTotal = medicines.stream()
            .map(InvoiceMedicine::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.totalAmount = treatmentTotal.add(medicineTotal);
    }
}