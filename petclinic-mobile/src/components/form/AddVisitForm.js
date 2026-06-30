import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddVisitForm({ onSave }) {
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        onSave({ petId: 0, date, description });
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.header}>New Visit</Text>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-06-30" />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Add Visit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: { padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    label: { marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
    submitButton: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});