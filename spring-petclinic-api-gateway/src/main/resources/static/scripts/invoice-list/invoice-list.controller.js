'use strict';

angular.module('invoiceList')
    .controller('InvoiceListController', ['$http', function($http) {
        var self = this;
        self.invoices = [];
        self.showForm = false;
        self.newInvoice = { treatments: [], medicines: [] };
        self.treatments = [];
        self.medicines = [];
        self.owners = [];
        self.pets = [];
        self.visits = [];
        self.selectedOwner = null;
        self.selectedPet = null;
        self.selectedVisit = null;
        self.selectedTreatment = {};
        self.selectedMedicine = {};
        self.treatmentQty = 1;
        self.medicineQty = 1;

        // Load invoices
        var loadInvoices = function() {
            $http.get('api/invoice/invoices')
                .then(function(resp) {
                    self.invoices = resp.data;
                });
        };
        loadInvoices();

        // Load treatments and medicines
        $http.get('api/treatment/treatments')
            .then(function(resp) { self.treatments = resp.data; });

        $http.get('api/treatment/medicines')
            .then(function(resp) { self.medicines = resp.data; });

        // Load owners for dropdown
        $http.get('api/customer/owners')
            .then(function(resp) { self.owners = resp.data; });

        // When owner selected → load their pets
        self.onOwnerSelected = function() {
            self.selectedPet = null;
            self.selectedVisit = null;
            self.pets = [];
            self.visits = [];
            self.newInvoice.ownerId = null;
            self.newInvoice.petId = null;
            self.newInvoice.visitId = null;

            if (self.selectedOwner) {
                self.newInvoice.ownerId = self.selectedOwner.id;
                self.pets = self.selectedOwner.pets || [];
            }
        };

        // When pet selected → load their visits
        self.onPetSelected = function() {
            self.selectedVisit = null;
            self.visits = [];
            self.newInvoice.petId = null;
            self.newInvoice.visitId = null;

            if (self.selectedPet && self.selectedOwner) {
                self.newInvoice.petId = self.selectedPet.id;
                $http.get('api/visit/owners/' + self.selectedOwner.id + '/pets/' + self.selectedPet.id + '/visits')
                    .then(function(resp) {
                        self.visits = resp.data;
                    });
            }
        };

        // When visit selected → set visitId
        self.onVisitSelected = function() {
            if (self.selectedVisit) {
                self.newInvoice.visitId = self.selectedVisit.id;
            }
        };

        // Add treatment to invoice
        self.addTreatment = function() {
            if (self.selectedTreatment && self.selectedTreatment.id) {
                self.newInvoice.treatments.push({
                    treatmentId: self.selectedTreatment.id,
                    treatmentName: self.selectedTreatment.name,
                    unitPrice: self.selectedTreatment.price,
                    quantity: self.treatmentQty || 1
                });
                self.selectedTreatment = null;
                self.treatmentQty = 1;
            }
        };

        // Add medicine to invoice
        self.addMedicine = function() {
            if (self.selectedMedicine && self.selectedMedicine.id) {
                self.newInvoice.medicines.push({
                    medicineId: self.selectedMedicine.id,
                    medicineName: self.selectedMedicine.name,
                    unitPrice: self.selectedMedicine.price,
                    quantity: self.medicineQty || 1
                });
                self.selectedMedicine = null;
                self.medicineQty = 1;
            }
        };

        // Remove treatment from list
        self.removeTreatment = function(index) {
            self.newInvoice.treatments.splice(index, 1);
        };

        // Remove medicine from list
        self.removeMedicine = function(index) {
            self.newInvoice.medicines.splice(index, 1);
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
                .then(function() {
                    // reload full list to get correct data
                    loadInvoices();
                    self.newInvoice = { treatments: [], medicines: [] };
                    self.selectedOwner = null;
                    self.selectedPet = null;
                    self.selectedVisit = null;
                    self.pets = [];
                    self.visits = [];
                    self.showForm = false;
                });
        };

        // Mark as paid
        self.markAsPaid = function(id) {
            $http.put('api/invoice/invoices/' + id + '/status?status=PAID')
                .then(function() {
                    loadInvoices();
                });
        };
    }]);