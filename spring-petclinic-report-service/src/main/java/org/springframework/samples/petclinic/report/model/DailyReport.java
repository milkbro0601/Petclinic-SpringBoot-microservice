package org.springframework.samples.petclinic.report.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyReport {
    private String date;
    private int totalVisits;
    private List<VisitResponse> visits;
}
