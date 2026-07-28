package org.springframework.samples.petclinic.report.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VisitResponse {
    private Integer id;
    private int petId;
    private String description;
    private String date;  // plain String, no Jackson date parsing
}