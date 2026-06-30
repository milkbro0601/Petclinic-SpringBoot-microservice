import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getReportSummary, getDailyReport, getMonthlyReport, getAnnualReport } from '../service/api';

export default function ReportsScreen() {
    const [filter, setFilter] = useState('Daily');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const [summary, setSummary] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [annualData, setAnnualData] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        fetchSummary();
        fetchDaily();
        fetchMonthly();
        fetchAnnual();
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await getReportSummary();
            setSummary(res.data);
        } catch (err) { console.log(err); }
        finally { setLoading(false); }
    };

    const fetchDaily = async () => {
        try {
            const res = await getDailyReport(formatDate(date));
            setDailyData(res.data);
        } catch (err) { console.log(err); }
    };

    const fetchMonthly = async () => {
        try {
            const res = await getMonthlyReport(month, year);
            setMonthlyData(res.data);
        } catch (err) { console.log(err); }
    };

    const fetchAnnual = async () => {
        try {
            const res = await getAnnualReport(year);
            setAnnualData(res.data);
        } catch (err) { console.log(err); }
    };

    const onChange = (event, selectedDate) => {
        setShow(false);
        if (selectedDate) {
            setDate(selectedDate);
            getDailyReport(formatDate(selectedDate)).then(res => setDailyData(res.data));
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    const tableData = filter === 'Daily'
        ? (dailyData?.visits || []).map(v => ({ date: v.date, visits: 1 }))
        : filter === 'Monthly'
            ? Object.entries(monthlyData?.dailyBreakdown || {}).map(([date, visits]) => ({ date, visits }))
            : Object.entries(annualData?.monthlyBreakdown || {}).map(([date, visits]) => ({ date, visits }));

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            {/* KPI Summary Cards */}
            <View style={styles.row}>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>Today</Text>
                    <Text style={styles.kpiValue}>{summary?.totalVisitsToday || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>This Month</Text>
                    <Text style={styles.kpiValue}>{summary?.totalVisitsThisMonth || 0}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>This Year</Text>
                    <Text style={styles.kpiValue}>{summary?.totalVisitsThisYear || 0}</Text>
                </View>
                <View style={styles.kpiCard}>
                    <Text style={styles.kpiLabel}>All Time</Text>
                    <Text style={styles.kpiValue}>{summary?.totalVisitsAllTime || 0}</Text>
                </View>
            </View>

            {/* Toggle */}
            <View style={styles.toggleContainer}>
                {['Daily', 'Monthly', 'Annual'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.toggleButton, filter === type && styles.activeButton]}
                        onPress={() => setFilter(type)}>
                        <Text style={filter === type ? styles.activeText : styles.toggleText}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Daily Filter */}
            {filter === 'Daily' && (
                <View style={styles.filterBox}>
                    <Text style={styles.filterLabel}>Select Date</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShow(true)}>
                        <Text style={styles.dateText}>📅  {formatDate(date)}</Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker value={date} mode="date" display="spinner" onChange={onChange} />
                    )}
                    <Text style={styles.resultText}>
                        Total visits on <Text style={styles.bold}>{formatDate(date)}</Text>: <Text style={styles.bold}>{dailyData?.totalVisits || 0}</Text>
                    </Text>
                </View>
            )}

            {/* Monthly Filter */}
            {filter === 'Monthly' && (
                <View style={styles.filterBox}>
                    <Text style={styles.resultText}>
                        Total visits for <Text style={styles.bold}>{month}/{year}</Text>: <Text style={styles.bold}>{monthlyData?.totalVisits || 0}</Text>
                    </Text>
                </View>
            )}

            {/* Annual Filter */}
            {filter === 'Annual' && (
                <View style={styles.filterBox}>
                    <Text style={styles.resultText}>
                        Total visits for <Text style={styles.bold}>{year}</Text>: <Text style={styles.bold}>{annualData?.totalVisits || 0}</Text>
                    </Text>
                </View>
            )}

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Date</Text>
                    <Text style={styles.headerText}>Visits</Text>
                </View>
                {tableData.map((item, index) => (
                    <View key={index} style={[styles.tableRow, index % 2 === 0 && { backgroundColor: '#f9f9f9' }]}>
                        <Text style={styles.tableCell}>{item.date}</Text>
                        <Text style={styles.tableCell}>{item.visits}</Text>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 15, paddingBottom: 30 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    kpiCard: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 12, alignItems: 'center' },
    kpiLabel: { color: '#666', fontSize: 13 },
    kpiValue: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', marginTop: 5 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 5, borderRadius: 10, marginVertical: 15 },
    toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    activeButton: { backgroundColor: '#4CAF50' },
    toggleText: { fontWeight: '600', color: '#555' },
    activeText: { color: '#fff', fontWeight: '600' },
    filterBox: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15 },
    filterLabel: { fontSize: 13, color: '#666', marginBottom: 6 },
    dateInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10, backgroundColor: '#fafafa' },
    dateText: { fontSize: 15, color: '#333' },
    resultText: { fontSize: 14, color: '#555', marginTop: 5 },
    bold: { fontWeight: 'bold', color: '#333' },
    table: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
    tableHeader: { flexDirection: 'row', backgroundColor: '#333', padding: 12, justifyContent: 'space-between' },
    headerText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#eee', justifyContent: 'space-between' },
    tableCell: { fontSize: 14, color: '#333' },
});