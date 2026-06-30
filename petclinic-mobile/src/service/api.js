import axios from 'axios';

const API_BASE = 'http://10.24.41.179:8080';

export const getOwners = () =>
    axios.get(`${API_BASE}/api/customer/owners`);

export const getVets = () =>
    axios.get(`${API_BASE}/api/vet/vets`);

export const getTreatments = () =>
    axios.get(`${API_BASE}/api/treatment/treatments`);

export const getInvoices = () =>
    axios.get(`${API_BASE}/api/invoice/invoices`);

export const getReportSummary = () =>
    axios.get(`${API_BASE}/api/report/reports/summary`);