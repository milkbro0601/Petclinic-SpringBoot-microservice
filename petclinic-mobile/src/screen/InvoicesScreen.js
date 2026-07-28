import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getInvoices, markInvoicePaid, getOwners, getTreatments, getMedicines, createInvoice } from '../service/api';

export default function InvoicesScreen() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await getInvoices();
            setInvoices(response.data);
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async (id) => {
        try {
            await markInvoicePaid(id);
            await fetchInvoices();
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to update invoice');
        }
    };

    const renderInvoice = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.date}>📅 {item.invoiceDate?.split('T')[0]}</Text>
                <Text style={[styles.statusBadge, item.status === 'PAID' ? styles.statusPaid : styles.statusPending]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.detailsRow}>
                <Text style={styles.detailsText}>Owner ID: {item.ownerId}</Text>
                <Text style={styles.detailsText}>Pet ID: {item.petId}</Text>
            </View>
            <View style={styles.footerRow}>
                <Text style={styles.total}>RM {item.totalAmount}</Text>
                {item.status === 'PENDING' && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleMarkPaid(item.id)}>
                        <Text style={styles.actionButtonText}>Mark Paid</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {isCreating ? (
                <CreateInvoiceForm
                    onCancel={() => setIsCreating(false)}
                    onSuccess={() => { setIsCreating(false); fetchInvoices(); }}
                />
            ) : (
                <>
                    <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
                        <Text style={styles.createButtonText}>+ Create Invoice</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={invoices}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderInvoice}
                        contentContainerStyle={styles.listContainer}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

function CreateInvoiceForm({ onCancel, onSuccess }) {
    const [owners, setOwners] = useState([]);
    const [treatmentsList, setTreatmentsList] = useState([]);
    const [medicinesList, setMedicinesList] = useState([]);

    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);

    const [treatments, setTreatments] = useState([]);
    const [medicines, setMedicines] = useState([]);

    const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);
    const [treatmentQty, setTreatmentQty] = useState('1');
    const [selectedMedicineId, setSelectedMedicineId] = useState(null);
    const [medicineQty, setMedicineQty] = useState('1');

    useEffect(() => {
        getOwners().then(res => setOwners(res.data));
        getTreatments().then(res => setTreatmentsList(res.data));
        getMedicines().then(res => setMedicinesList(res.data));
    }, []);

    const addTreatment = () => {
        const t = treatmentsList.find(x => x.id === selectedTreatmentId);
        if (!t) return;
        setTreatments([...treatments, {
            treatmentId: t.id,
            treatmentName: t.name,
            unitPrice: t.price,
            quantity: parseInt(treatmentQty) || 1
        }]);
        setSelectedTreatmentId(null);
        setTreatmentQty('1');
    };

    const addMedicine = () => {
        const m = medicinesList.find(x => x.id === selectedMedicineId);
        if (!m) return;
        setMedicines([...medicines, {
            medicineId: m.id,
            medicineName: m.name,
            unitPrice: m.price,
            quantity: parseInt(medicineQty) || 1
        }]);
        setSelectedMedicineId(null);
        setMedicineQty('1');
    };

    const calculateTotal = () => {
        let total = 0;
        treatments.forEach(t => total += t.unitPrice * t.quantity);
        medicines.forEach(m => total += m.unitPrice * m.quantity);
        return total.toFixed(2);
    };

    const handleSubmit = async () => {
        if (!selectedPet) {
            Alert.alert('Error', 'Please select owner and pet');
            return;
        }
        try {
            await createInvoice({
                visitId: 1,
                petId: selectedPet.id,
                ownerId: selectedOwner.id,
                treatments,
                medicines
            });
            Alert.alert('Success', 'Invoice created');
            onSuccess();
        } catch (err) {
            console.log(err.response?.data || err.message);
            Alert.alert('Error', 'Failed to create invoice');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>New Invoice</Text>

                <Text style={styles.label}>Select Owner</Text>
                <View style={styles.typeRow}>
                    {owners.map(o => (
                        <TouchableOpacity
                            key={o.id}
                            style={[styles.typeBtn, selectedOwner?.id === o.id && styles.typeBtnActive]}
                            onPress={() => { setSelectedOwner(o); setSelectedPet(null); }}>
                            <Text style={selectedOwner?.id === o.id ? styles.typeTextActive : styles.typeText}>
                                {o.firstName} {o.lastName}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedOwner && (
                    <>
                        <Text style={styles.label}>Select Pet</Text>
                        <View style={styles.typeRow}>
                            {selectedOwner.pets?.map(p => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[styles.typeBtn, selectedPet?.id === p.id && styles.typeBtnActive]}
                                    onPress={() => setSelectedPet(p)}>
                                    <Text style={selectedPet?.id === p.id ? styles.typeTextActive : styles.typeText}>
                                        {p.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                <Text style={styles.sectionTitle}>Treatments</Text>
                <View style={styles.typeRow}>
                    {treatmentsList.map(t => (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.typeBtn, selectedTreatmentId === t.id && styles.typeBtnActive]}
                            onPress={() => setSelectedTreatmentId(t.id)}>
                            <Text style={selectedTreatmentId === t.id ? styles.typeTextActive : styles.typeText}>
                                {t.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    <TextInput style={[styles.input, { flex: 1 }]} value={treatmentQty} onChangeText={setTreatmentQty} keyboardType="numeric" />
                    <TouchableOpacity style={styles.addButton} onPress={addTreatment}>
                        <Text style={styles.btnText}>Add</Text>
                    </TouchableOpacity>
                </View>
                {treatments.map((t, i) => (
                    <Text key={i} style={styles.itemText}>{t.treatmentName} x{t.quantity} - RM {(t.unitPrice * t.quantity).toFixed(2)}</Text>
                ))}

                <Text style={styles.sectionTitle}>Medicines</Text>
                <View style={styles.typeRow}>
                    {medicinesList.map(m => (
                        <TouchableOpacity
                            key={m.id}
                            style={[styles.typeBtn, selectedMedicineId === m.id && styles.typeBtnActive]}
                            onPress={() => setSelectedMedicineId(m.id)}>
                            <Text style={selectedMedicineId === m.id ? styles.typeTextActive : styles.typeText}>
                                {m.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.row}>
                    <TextInput style={[styles.input, { flex: 1 }]} value={medicineQty} onChangeText={setMedicineQty} keyboardType="numeric" />
                    <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
                        <Text style={styles.btnText}>Add</Text>
                    </TouchableOpacity>
                </View>
                {medicines.map((m, i) => (
                    <Text key={i} style={styles.itemText}>{m.medicineName} x{m.quantity} - RM {(m.unitPrice * m.quantity).toFixed(2)}</Text>
                ))}

                <Text style={styles.total}>Total: RM {calculateTotal()}</Text>
                <View style={styles.btnRow}>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745' }]} onPress={handleSubmit}>
                        <Text style={styles.actionButtonText}>Create Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 10, padding: 10 }} onPress={onCancel}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    createButton: { backgroundColor: '#4CAF50', padding: 15, margin: 15, borderRadius: 8, alignItems: 'center' },
    createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 12, borderRadius: 8 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    date: { fontSize: 16, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontWeight: 'bold' },
    statusPaid: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
    statusPending: { backgroundColor: '#FFF3E0', color: '#EF6C00' },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
    total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    actionButton: { backgroundColor: '#388E3C', padding: 10, borderRadius: 5 },
    actionButtonText: { color: '#fff', fontWeight: 'bold' },
    formContainer: { padding: 20, backgroundColor: '#fff', margin: 15, borderRadius: 8 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginTop: 5 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
    label: { marginTop: 10, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    addButton: { backgroundColor: '#333', padding: 10, marginLeft: 10, borderRadius: 5 },
    btnText: { color: '#fff' },
    btnRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5, marginBottom: 10 },
    typeBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
    typeBtnActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    typeText: { color: '#333' },
    typeTextActive: { color: '#fff', fontWeight: 'bold' },
    itemText: { fontSize: 13, color: '#555', marginVertical: 2 }
});