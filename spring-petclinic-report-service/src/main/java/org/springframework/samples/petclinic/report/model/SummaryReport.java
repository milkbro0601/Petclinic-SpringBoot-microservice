package org.springframework.samples.petclinic.report.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummaryReport {
    private long totalVisitsAllTime;
    private long totalVisitsThisYear;
    private long totalVisitsThisMonth;
    private long totalVisitsToday;
    private String busiestMonth;
    private String busiestDay;
}
