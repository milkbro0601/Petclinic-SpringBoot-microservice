import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getPetTypes } from '../../service/api';

export default function EditPetForm({ initialData, onSave, onCancel }) {
    const pet = initialData || {};
    const [name, setName] = useState(pet.name || '');
    const [birthDate, setBirthDate] = useState(pet.birthDate || '');
    const [petTypes, setPetTypes] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(pet.typeId || null);

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
            <Text style={styles.header}>Edit Pet</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Birth date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} />
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
                <Text style={styles.buttonText}>Save Pet</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: { padding: 20, backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    label: { marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 15 },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    typeBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
    typeBtnActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    typeText: { color: '#333' },
    typeTextActive: { color: '#fff', fontWeight: 'bold' },
    submitButton: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});