import axios from 'axios';

const API_BASE = 'http://localhost:8080';

export const getOwners = () =>
    axios.get(`${API_BASE}/api/customer/owners`);

export const getOwnerById = (id) =>
    axios.get(`${API_BASE}/api/customer/owners/${id}`);

export const getVets = () =>
    axios.get(`${API_BASE}/api/vet/vets`);

export const getVisitsByPet = (ownerId, petId) =>
    axios.get(`${API_BASE}/api/visit/owners/${ownerId}/pets/${petId}/visits`);

export const getTreatments = () =>
    axios.get(`${API_BASE}/api/treatment/treatments`);

export const getMedicines = () =>
    axios.get(`${API_BASE}/api/treatment/medicines`);

export const getInvoices = () =>
    axios.get(`${API_BASE}/api/invoice/invoices`);

export const createInvoice = (invoice) =>
    axios.post(`${API_BASE}/api/invoice/invoices`, invoice);

export const markInvoicePaid = (id) =>
    axios.put(`${API_BASE}/api/invoice/invoices/${id}/status?status=PAID`);

export const getReportSummary = () =>
    axios.get(`${API_BASE}/api/report/reports/summary`);

export const getDailyReport = (date) =>
    axios.get(`${API_BASE}/api/report/reports/daily?date=${date}`);

export const getMonthlyReport = (month, year) =>
    axios.get(`${API_BASE}/api/report/reports/monthly?month=${month}&year=${year}`);

export const getAnnualReport = (year) =>
    axios.get(`${API_BASE}/api/report/reports/annual?year=${year}`);

export const updateOwner = (id, data) =>
    axios.put(`${API_BASE}/api/customer/owners/${id}`, data);

export const addPet = (ownerId, data) =>
    axios.post(`${API_BASE}/api/customer/owners/${ownerId}/pets`, data);

export const updatePet = (petId, data) =>
    axios.put(`${API_BASE}/api/customer/owners/*/pets/${petId}`, { ...data, id: petId });

export const getPetTypes = () =>
    axios.get(`${API_BASE}/api/customer/petTypes`);

export const addVisit = (petId, data) =>
    axios.post(`${API_BASE}/api/visit/owners/*/pets/${petId}/visits`, data);

export const addTreatment = (data) =>
    axios.post(`${API_BASE}/api/treatment/treatments`, data);

export const deleteTreatment = (id) =>
    axios.delete(`${API_BASE}/api/treatment/treatments/${id}`);

export const addMedicine = (data) =>
    axios.post(`${API_BASE}/api/treatment/medicines`, data);

export const deleteMedicine = (id) =>
    axios.delete(`${API_BASE}/api/treatment/medicines/${id}`);