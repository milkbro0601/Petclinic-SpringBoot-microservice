package org.springframework.samples.petclinic.report.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyReport {
    private int month;
    private int year;
    private int totalVisits;
    private Map<String, Long> dailyBreakdown;
}
