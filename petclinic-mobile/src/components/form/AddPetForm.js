import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddPetForm({ onSave, onCancel }) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [type, setType] = useState('');

    return (
        <View style={styles.formContainer}>
            <Text style={styles.header}>New Pet</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={styles.label}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} />
            <Text style={styles.label}>Type</Text>
            <TextInput style={styles.input} value={type} onChangeText={setType} />
            <TouchableOpacity style={styles.submitButton} onPress={() => onSave({ name, birthDate, type })}>
                <Text style={styles.buttonText}>Add Pet</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    label: { marginBottom: 5, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
    submitButton: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});