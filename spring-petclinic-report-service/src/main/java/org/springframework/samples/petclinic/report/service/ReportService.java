package org.springframework.samples.petclinic.report.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.samples.petclinic.report.client.VisitClient;
import org.springframework.samples.petclinic.report.model.*;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);
    private final VisitClient visitClient;

    public DailyReport getDailyReport(LocalDate date) {
        log.info("Generating daily report for date: {}", date);
        List<VisitResponse> allVisits = visitClient.getAllVisits();

        List<VisitResponse> dailyVisits = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .filter(v -> {
                LocalDate visitDate = v.getDate()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
                return visitDate.equals(date);
            })
            .collect(Collectors.toList());

        return DailyReport.builder()
            .date(date.toString())
            .totalVisits(dailyVisits.size())
            .visits(dailyVisits)
            .build();
    }

    public MonthlyReport getMonthlyReport(int month, int year) {
        log.info("Generating monthly report for month: {} year: {}", month, year);
        List<VisitResponse> allVisits = visitClient.getAllVisits();

        List<VisitResponse> monthlyVisits = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .filter(v -> {
                Calendar cal = Calendar.getInstance();
                cal.setTime(v.getDate());
                return cal.get(Calendar.MONTH) + 1 == month
                    && cal.get(Calendar.YEAR) == year;
            })
            .collect(Collectors.toList());

        Map<String, Long> dailyBreakdown = monthlyVisits.stream()
            .collect(Collectors.groupingBy(
                v -> new SimpleDateFormat("yyyy-MM-dd").format(v.getDate()),
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
        log.info("Generating annual report for year: {}", year);
        List<VisitResponse> allVisits = visitClient.getAllVisits();

        List<VisitResponse> annualVisits = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .filter(v -> {
                Calendar cal = Calendar.getInstance();
                cal.setTime(v.getDate());
                return cal.get(Calendar.YEAR) == year;
            })
            .collect(Collectors.toList());

        Map<String, Long> monthlyBreakdown = annualVisits.stream()
            .collect(Collectors.groupingBy(
                v -> {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(v.getDate());
                    return cal.getDisplayName(
                        Calendar.MONTH,
                        Calendar.LONG,
                        Locale.ENGLISH
                    );
                },
                Collectors.counting()
            ));

        return AnnualReport.builder()
            .year(year)
            .totalVisits(annualVisits.size())
            .monthlyBreakdown(monthlyBreakdown)
            .build();
    }

    public SummaryReport getSummaryReport() {
        log.info("Generating summary report");
        List<VisitResponse> allVisits = visitClient.getAllVisits();

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        long todayCount = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .filter(v -> {
                LocalDate visitDate = v.getDate()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
                return visitDate.equals(today);
            })
            .count();

        long monthCount = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .filter(v -> {
                Calendar cal = Calendar.getInstance();
                cal.setTime(v.getDate());
                return cal.get(Calendar.MONTH) + 1 == currentMonth
                    && cal.get(Calendar.YEAR) == currentYear;
            })
            .count();

        long yearCount = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .filter(v -> {
                Calendar cal = Calendar.getInstance();
                cal.setTime(v.getDate());
                return cal.get(Calendar.YEAR) == currentYear;
            })
            .count();

        // find busiest month
        Map<String, Long> monthlyBreakdown = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .collect(Collectors.groupingBy(
                v -> {
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(v.getDate());
                    return cal.getDisplayName(
                        Calendar.MONTH,
                        Calendar.LONG,
                        Locale.ENGLISH
                    );
                },
                Collectors.counting()
            ));

        String busiestMonth = monthlyBreakdown.entrySet()
            .stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("N/A");

        // find busiest day
        Map<String, Long> dayBreakdown = allVisits.stream()
            .filter(v -> v.getDate() != null)
            .collect(Collectors.groupingBy(
                v -> {
                    LocalDate visitDate = v.getDate()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                    return visitDate.getDayOfWeek()
                        .getDisplayName(TextStyle.FULL, Locale.ENGLISH);
                },
                Collectors.counting()
            ));

        String busiestDay = dayBreakdown.entrySet()
            .stream()
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
