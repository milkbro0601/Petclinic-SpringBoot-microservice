import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getPetTypes } from '../../service/api';

export default function AddPetForm({ onSave, onCancel }) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [petTypes, setPetTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);

    useEffect(() => {
        getPetTypes().then(res => setPetTypes(res.data));
    }, []);

    const handleSave = () => {
        onSave({
            id: 0,
            name,
            birthDate,
            typeId: selectedTypeId
        });
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.header}>New Pet</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="2026-01-15" />
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
                {petTypes.map((t) => (
                    <TouchableOpacity
                        key={t.id}
                        style={[styles.typeBtn, selectedTypeId === t.id && styles.typeBtnActive]}
                        onPress={() => setSelectedTypeId(t.id)}>
                        <Text style={selectedTypeId === t.id ? styles.typeTextActive : styles.typeText}>
                            {t.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Add Pet</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: { padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    label: { marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    typeBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
    typeBtnActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    typeText: { color: '#333' },
    typeTextActive: { color: '#fff', fontWeight: 'bold' },
    submitButton: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});