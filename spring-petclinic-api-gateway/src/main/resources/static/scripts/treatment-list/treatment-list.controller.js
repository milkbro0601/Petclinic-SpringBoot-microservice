'use strict';

angular.module('treatmentList')
    .controller('TreatmentListController', ['$http', function($http) {
        var self = this;
        self.treatments = [];
        self.medicines = [];
        self.showTreatmentForm = false;
        self.showMedicineForm = false;
        self.newTreatment = {};
        self.newMedicine = {};

        // Get all treatments
        $http.get('api/treatment/treatments')
            .then(function(resp) {
                self.treatments = resp.data;
            });

        // Get all medicines
        $http.get('api/treatment/medicines')
            .then(function(resp) {
                self.medicines = resp.data;
            });

        // Add treatment
        self.addTreatment = function() {
            $http.post('api/treatment/treatments', self.newTreatment)
                .then(function(resp) {
                    self.treatments.push(resp.data);
                    self.newTreatment = {};
                    self.showTreatmentForm = false;
                });
        };

        // Delete treatment
        self.deleteTreatment = function(id) {
            $http.delete('api/treatment/treatments/' + id)
                .then(function() {
                    self.treatments = self.treatments
                        .filter(function(t) { return t.id !== id; });
                });
        };

        // Add medicine
        self.addMedicine = function() {
            $http.post('api/treatment/medicines', self.newMedicine)
                .then(function(resp) {
                    self.medicines.push(resp.data);
                    self.newMedicine = {};
                    self.showMedicineForm = false;
                });
        };

        // Delete medicine
        self.deleteMedicine = function(id) {
            $http.delete('api/treatment/medicines/' + id)
                .then(function() {
                    self.medicines = self.medicines
                        .filter(function(m) { return m.id !== id; });
                });
        };
    }]);