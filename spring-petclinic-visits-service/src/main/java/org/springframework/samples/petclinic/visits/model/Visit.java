package org.springframework.samples.petclinic.visits.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Table(name = "visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "visit_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Builder.Default
    private LocalDate date = LocalDate.now();

    @Size(max = 8192)
    @Column(name = "description")
    private String description;

    @Column(name = "pet_id")
    private int petId;
}
