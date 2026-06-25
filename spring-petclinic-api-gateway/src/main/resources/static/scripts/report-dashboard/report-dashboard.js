'use strict';

angular.module('reportDashboard', ['ui.router'])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('reports', {
                parent: 'app',
                url: '/reports',
                template: '<report-dashboard></report-dashboard>'
            });
    }]);