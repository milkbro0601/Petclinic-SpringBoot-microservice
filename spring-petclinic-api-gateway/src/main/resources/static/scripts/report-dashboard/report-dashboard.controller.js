'use strict';

angular.module('reportDashboard')
    .controller('ReportDashboardController', ['$http', function($http) {
        var self = this;
        self.summary = {};
        self.dailyReport = {};
        self.monthlyReport = {};
        self.annualReport = {};
        self.selectedDate = new Date().toISOString().split('T')[0];
        self.selectedMonth = new Date().getMonth() + 1;
        self.selectedYear = new Date().getFullYear();

        // Get summary report
        $http.get('api/report/reports/summary')
            .then(function(resp) {
                self.summary = resp.data;
            });

        // Get daily report
        self.getDailyReport = function() {
            $http.get('api/report/reports/daily?date=' + self.selectedDate)
                .then(function(resp) {
                    self.dailyReport = resp.data;
                });
        };

        // Get monthly report
        self.getMonthlyReport = function() {
            $http.get('api/report/reports/monthly?month=' + self.selectedMonth + '&year=' + self.selectedYear)
                .then(function(resp) {
                    self.monthlyReport = resp.data;
                });
        };

        // Get annual report
        self.getAnnualReport = function() {
            $http.get('api/report/reports/annual?year=' + self.selectedYear)
                .then(function(resp) {
                    self.annualReport = resp.data;
                });
        };

        // Load all on start
        self.getDailyReport();
        self.getMonthlyReport();
        self.getAnnualReport();
    }]);