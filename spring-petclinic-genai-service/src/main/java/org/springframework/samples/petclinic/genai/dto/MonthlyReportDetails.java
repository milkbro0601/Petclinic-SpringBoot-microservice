package org.springframework.samples.petclinic.genai.dto;

import java.util.Map;

public record MonthlyReportDetails(int month, int year, int totalVisits, Map<String, Long> dailyBreakdown) {
}
