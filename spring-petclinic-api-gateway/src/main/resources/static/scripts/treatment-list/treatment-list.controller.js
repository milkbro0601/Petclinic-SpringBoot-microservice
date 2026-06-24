'use strict';

angular.module('treatmentList')
    .controller('TreatmentListController', ['$http', function($http) {
        var self = this;

        $http.get('api/treatment/treatments')
            .then(function(resp) {
                self.treatments = resp.data;
            });

        $http.get('api/treatment/medicines')
            .then(function(resp) {
                self.medicines = resp.data;
            });

    }]);
