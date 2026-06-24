'use strict';

angular.module('invoiceList')
    .controller('InvoiceListController', ['$http', function($http) {
        var self = this;
        self.invoices = [];
        self.showForm = false;
        self.newInvoice = {
            treatments: [],
            medicines: []
        };
        self.treatments = [];
        self.medicines = [];
        self.selectedTreatment = {};
        self.selectedMedicine = {};

        // Get all invoices
        $http.get('api/invoice/invoices')
            .then(function(resp) {
                self.invoices = resp.data;
            });

        // Get treatments for dropdown
        $http.get('api/treatment/treatments')
            .then(function(resp) {
                self.treatments = resp.data;
            });

        // Get medicines for dropdown
        $http.get('api/treatment/medicines')
            .then(function(resp) {
                self.medicines = resp.data;
            });

        // Add treatment to invoice
        self.addTreatment = function() {
            if (self.selectedTreatment.id) {
                self.newInvoice.treatments.push({
                    treatmentId: self.selectedTreatment.id,
                    treatmentName: self.selectedTreatment.name,
                    unitPrice: self.selectedTreatment.price,
                    quantity: self.treatmentQty || 1
                });
                self.selectedTreatment = {};
                self.treatmentQty = 1;
            }
        };

        // Add medicine to invoice
        self.addMedicine = function() {
            if (self.selectedMedicine.id) {
                self.newInvoice.medicines.push({
                    medicineId: self.selectedMedicine.id,
                    medicineName: self.selectedMedicine.name,
                    unitPrice: self.selectedMedicine.price,
                    quantity: self.medicineQty || 1
                });
                self.selectedMedicine = {};
                self.medicineQty = 1;
            }
        };

        // Calculate total
        self.calculateTotal = function() {
            var total = 0;
            self.newInvoice.treatments.forEach(function(t) {
                total += t.unitPrice * t.quantity;
            });
            self.newInvoice.medicines.forEach(function(m) {
                total += m.unitPrice * m.quantity;
            });
            return total.toFixed(2);
        };

        // Submit invoice
        self.submitInvoice = function() {
            $http.post('api/invoice/invoices', self.newInvoice)
                .then(function(resp) {
                    self.invoices.push(resp.data);
                    self.newInvoice = { treatments: [], medicines: [] };
                    self.showForm = false;
                });
        };

        // Mark as paid
        self.markAsPaid = function(id) {
            $http.put('api/invoice/invoices/' + id + '/status?status=PAID')
                .then(function() {
                    self.invoices.forEach(function(inv) {
                        if (inv.id === id) inv.status = 'PAID';
                    });
                });
        };
    }]);