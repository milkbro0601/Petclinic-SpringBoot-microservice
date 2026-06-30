import React, { useState, useEffect } from 'react';
import TreatmentMedicineForm from '../components/form/TreatmentMedicineForm';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getTreatments, getMedicines, addTreatment, addMedicine, deleteTreatment, deleteMedicine } from '../service/api';

export default function TreatmentsScreen() {
    const [treatments, setTreatments] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeForm, setActiveForm] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tRes, mRes] = await Promise.all([getTreatments(), getMedicines()]);
            setTreatments(tRes.data);
            setMedicines(mRes.data);
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to load treatments/medicines');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (data) => {
        try {
            const payload = {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price)
            };
            if (activeForm === 'treatment') {
                await addTreatment(payload);
            } else {
                await addMedicine({ ...payload, unit: data.unit });
            }
            await fetchData();
            setActiveForm(null);
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to save');
        }
    };

    const handleDeleteTreatment = async (id) => {
        try {
            await deleteTreatment(id);
            await fetchData();
        } catch (err) {
            Alert.alert('Error', 'Failed to delete treatment');
        }
    };

    const handleDeleteMedicine = async (id) => {
        try {
            await deleteMedicine(id);
            await fetchData();
        } catch (err) {
            Alert.alert('Error', 'Failed to delete medicine');
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Treatments Section */}
            <View style={styles.section}>
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Treatments</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => setActiveForm('treatment')}>
                        <Text style={styles.btnText}>+ Add Treatment</Text>
                    </TouchableOpacity>
                </View>

                {activeForm === 'treatment' && (
                    <TreatmentMedicineForm type="Treatment" onSave={handleAdd} onCancel={() => setActiveForm(null)} />
                )}

                {treatments.map((t) => (
                    <View key={t.id} style={styles.row}>
                        <View style={styles.infoCol}>
                            <Text style={styles.bold}>{t.name}</Text>
                            <Text style={styles.desc}>{t.description}</Text>
                        </View>
                        <Text style={styles.price}>RM {t.price}</Text>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteTreatment(t.id)}>
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Medicines Section */}
            <View style={styles.section}>
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Medicines</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => setActiveForm('medicine')}>
                        <Text style={styles.btnText}>+ Add Medicine</Text>
                    </TouchableOpacity>
                </View>

                {activeForm === 'medicine' && (
                    <TreatmentMedicineForm type="Medicine" onSave={handleAdd} onCancel={() => setActiveForm(null)} />
                )}

                {medicines.map((m) => (
                    <View key={m.id} style={styles.row}>
                        <View style={styles.infoCol}>
                            <Text style={styles.bold}>{m.name}</Text>
                            <Text style={styles.desc}>{m.description} ({m.unit})</Text>
                        </View>
                        <Text style={styles.price}>RM {m.price}</Text>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteMedicine(m.id)}>
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    section: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    addButton: { backgroundColor: '#28a745', padding: 8, borderRadius: 5 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
    infoCol: { flex: 1 },
    bold: { fontWeight: 'bold' },
    desc: { color: '#666', fontSize: 12 },
    price: { marginHorizontal: 10, fontWeight: 'bold' },
    deleteBtn: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
    btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});