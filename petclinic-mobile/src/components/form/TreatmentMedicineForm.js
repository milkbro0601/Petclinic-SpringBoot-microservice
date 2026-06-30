import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function TreatmentMedicineForm({ type, onSave, onCancel }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState(''); 

    return (
        <View style={styles.formContainer}>
            <Text style={styles.header}>Add {type}</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
            {type === 'Medicine' && (
                <TextInput style={styles.input} placeholder="Unit (e.g. tablet, dose)" value={unit} onChangeText={setUnit} />
            )}
            <TextInput style={styles.input} placeholder="Price (RM)" value={price} onChangeText={setPrice} keyboardType="numeric" />
            
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={() => onSave({ name, description, price, unit })}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                    <Text>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 15 },
    header: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 10, borderRadius: 4, backgroundColor: '#fff' },
    btnRow: { flexDirection: 'row', gap: 10 },
    saveBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
    cancelBtn: { padding: 10 },
    btnText: { color: '#fff', fontWeight: 'bold' }
});