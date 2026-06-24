'use strict';

angular.module('treatmentList', ['ui.router'])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('treatments', {
                parent: 'app',
                url: '/treatments',
                template: '<treatment-list></treatment-list>'
            });
    }]);