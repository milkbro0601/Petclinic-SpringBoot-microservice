package org.springframework.samples.petclinic.visits.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Date;

@Entity
@Table(name = "visits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "visit_date")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date = new Date();

    @Size(max = 8192)
    @Column(name = "description")
    private String description;

    @Column(name = "pet_id")
    private int petId;
}
