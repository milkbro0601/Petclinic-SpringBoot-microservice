import React, { useState } from 'react';
import TreatmentMedicineForm from '../components/form/TreatmentMedicineForm';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function TreatmentsScreen() {
    const [treatments, setTreatments] = useState([
        { id: '1', name: 'General Checkup', desc: 'Routine health examination', price: 'RM 50' },
        { id: '2', name: 'Vaccination', desc: 'Annual vaccination', price: 'RM 30' },
    ]);

    const [medicines, setMedicines] = useState([
        { id: '1', name: 'Amoxicillin', desc: 'Antibiotic', unit: 'tablet', price: 'RM 5' },
    ]);

    const deleteItem = (setList, list, id) => {
        setList(list.filter(item => item.id !== id));
    };

    const [activeForm, setActiveForm] = useState(null); 

    const handleAdd = (data) => {
        if (activeForm === 'treatment') {
            setTreatments([...treatments, { id: Date.now().toString(), name: data.name, desc: data.description, price: 'RM ' + data.price }]);
        } else {
            setMedicines([...medicines, { id: Date.now().toString(), name: data.name, desc: data.description, unit: data.unit, price: 'RM ' + data.price }]);
        }
        setActiveForm(null);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Treatments Section */}
            <View style={styles.section}>
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Treatments</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => { setActiveForm('treatment')}}>
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
                            <Text style={styles.desc}>{t.desc}</Text>
                        </View>
                        <Text style={styles.price}>{t.price}</Text>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(setTreatments, treatments, t.id)}>
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Medicines Section */}
            <View style={styles.section}>
                <View style={styles.headerRow}>
                    <Text style={styles.sectionTitle}>Medicines</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => setActiveForm('medicine')}><Text style={styles.btnText}>+ Add Medicine</Text></TouchableOpacity>
                </View>

                {activeForm === 'medicine' && (
                    <TreatmentMedicineForm type="Medicine" onSave={handleAdd} onCancel={() => setActiveForm(null)} />
                )}

                {medicines.map((m) => (
                    <View key={m.id} style={styles.row}>
                        <View style={styles.infoCol}>
                            <Text style={styles.bold}>{m.name}</Text>
                            <Text style={styles.desc}>{m.desc} ({m.unit})</Text>
                        </View>
                        <Text style={styles.price}>{m.price}</Text>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(setMedicines, medicines, m.id)}>
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