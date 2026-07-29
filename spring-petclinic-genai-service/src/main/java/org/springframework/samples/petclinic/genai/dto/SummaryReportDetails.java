package org.springframework.samples.petclinic.genai.dto;

public record SummaryReportDetails(long totalVisitsAllTime, long totalVisitsThisYear, long totalVisitsThisMonth, long totalVisitsToday, String busiestMonth, String busiestDay) {
}
