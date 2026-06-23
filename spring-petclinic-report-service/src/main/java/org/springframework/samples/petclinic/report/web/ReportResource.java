package org.springframework.samples.petclinic.report.web;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.samples.petclinic.report.model.*;
import org.springframework.samples.petclinic.report.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportResource {

    private static final Logger log = LoggerFactory.getLogger(ReportResource.class);
    private final ReportService reportService;

    @GetMapping("/daily")
    public DailyReport getDailyReport(
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate date) {

        if (date == null) date = LocalDate.now();
        log.info("Request for daily report on date: {}", date);
        return reportService.getDailyReport(date);
    }

    @GetMapping("/monthly")
    public MonthlyReport getMonthlyReport(
        @RequestParam(required = false) Integer month,
        @RequestParam(required = false) Integer year) {

        if (month == null) month = LocalDate.now().getMonthValue();
        if (year == null) year = LocalDate.now().getYear();
        log.info("Request for monthly report month: {} year: {}", month, year);
        return reportService.getMonthlyReport(month, year);
    }

    @GetMapping("/annual")
    public AnnualReport getAnnualReport(
        @RequestParam(required = false) Integer year) {

        if (year == null) year = LocalDate.now().getYear();
        log.info("Request for annual report year: {}", year);
        return reportService.getAnnualReport(year);
    }

    @GetMapping("/summary")
    public SummaryReport getSummaryReport() {
        log.info("Request for summary report");
        return reportService.getSummaryReport();
    }
}
