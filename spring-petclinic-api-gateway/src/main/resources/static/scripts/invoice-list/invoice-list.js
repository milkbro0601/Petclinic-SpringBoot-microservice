'use strict';

angular.module('invoiceList', ['ui.router'])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('invoices', {
                parent: 'app',
                url: '/invoices',
                template: '<invoice-list></invoice-list>'
            });
    }]);