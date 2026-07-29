package org.springframework.samples.petclinic.genai.dto;

import java.util.List;

public record DailyReportDetails(String date, int totalVisits, List<VisitDetails> visits) {
}
