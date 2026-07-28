package org.springframework.samples.petclinic.report.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.samples.petclinic.report.client.VisitClient;
import org.springframework.samples.petclinic.report.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);
    private final VisitClient visitClient;

    public DailyReport getDailyReport(LocalDate date) {
    List<VisitResponse> allVisits = visitClient.getAllVisits();
    List<VisitResponse> dailyVisits = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .filter(v -> LocalDate.parse(v.getDate()).equals(date))
        .collect(Collectors.toList());

    return DailyReport.builder()
        .date(date.toString())
        .totalVisits(dailyVisits.size())
        .visits(dailyVisits)
        .build();
}

public MonthlyReport getMonthlyReport(int month, int year) {
    List<VisitResponse> allVisits = visitClient.getAllVisits();
    List<VisitResponse> monthlyVisits = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .filter(v -> {
            LocalDate d = LocalDate.parse(v.getDate());
            return d.getMonthValue() == month && d.getYear() == year;
        })
        .collect(Collectors.toList());

    Map<String, Long> dailyBreakdown = monthlyVisits.stream()
        .collect(Collectors.groupingBy(
            v -> v.getDate(),
            Collectors.counting()
        ));

    return MonthlyReport.builder()
        .month(month)
        .year(year)
        .totalVisits(monthlyVisits.size())
        .dailyBreakdown(dailyBreakdown)
        .build();
}

public AnnualReport getAnnualReport(int year) {
    List<VisitResponse> allVisits = visitClient.getAllVisits();
    List<VisitResponse> annualVisits = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .filter(v -> LocalDate.parse(v.getDate()).getYear() == year)
        .collect(Collectors.toList());

    Map<String, Long> monthlyBreakdown = annualVisits.stream()
        .collect(Collectors.groupingBy(
            v -> LocalDate.parse(v.getDate())
                .getMonth()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH),
            Collectors.counting()
        ));

    return AnnualReport.builder()
        .year(year)
        .totalVisits(annualVisits.size())
        .monthlyBreakdown(monthlyBreakdown)
        .build();
}

public SummaryReport getSummaryReport() {
    List<VisitResponse> allVisits = visitClient.getAllVisits();
    LocalDate today = LocalDate.now();

    long todayCount = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .filter(v -> LocalDate.parse(v.getDate()).equals(today))
        .count();

    long monthCount = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .filter(v -> {
            LocalDate d = LocalDate.parse(v.getDate());
            return d.getMonthValue() == today.getMonthValue()
                && d.getYear() == today.getYear();
        })
        .count();

    long yearCount = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .filter(v -> LocalDate.parse(v.getDate()).getYear() == today.getYear())
        .count();

    Map<String, Long> monthlyBreakdown = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .collect(Collectors.groupingBy(
            v -> LocalDate.parse(v.getDate())
                .getMonth()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH),
            Collectors.counting()
        ));

    String busiestMonth = monthlyBreakdown.entrySet().stream()
        .max(Map.Entry.comparingByValue())
        .map(Map.Entry::getKey)
        .orElse("N/A");

    Map<String, Long> dayBreakdown = allVisits.stream()
        .filter(v -> v.getDate() != null)
        .collect(Collectors.groupingBy(
            v -> LocalDate.parse(v.getDate())
                .getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH),
            Collectors.counting()
        ));

    String busiestDay = dayBreakdown.entrySet().stream()
        .max(Map.Entry.comparingByValue())
        .map(Map.Entry::getKey)
        .orElse("N/A");

    return SummaryReport.builder()
        .totalVisitsAllTime(allVisits.size())
        .totalVisitsThisYear(yearCount)
        .totalVisitsThisMonth(monthCount)
        .totalVisitsToday(todayCount)
        .busiestMonth(busiestMonth)
        .busiestDay(busiestDay)
        .build();
    }
}