package org.springframework.samples.petclinic.genai.dto;

import java.util.Map;

public record AnnualReportDetails(int year, int totalVisits, Map<String, Long> monthlyBreakdown) {
}
