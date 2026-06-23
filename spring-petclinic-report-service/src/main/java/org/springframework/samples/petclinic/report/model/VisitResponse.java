package org.springframework.samples.petclinic.report.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class VisitResponse {
    private Integer id;
    private int petId;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date;
}
