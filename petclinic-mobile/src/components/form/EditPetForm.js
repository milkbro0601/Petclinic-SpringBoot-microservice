import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditPetForm({ initialData, onSave, onCancel }) {
    // Safely handle initialData to prevent "undefined" errors
    const pet = initialData || {};
    
    const [name, setName] = useState(pet.name || '');
    const [birthDate, setBirthDate] = useState(pet.birthDate || '');
    const [type, setType] = useState(pet.type || '');

    return (
        <View style={styles.formContainer}>
            <Text style={styles.header}>Edit Pet</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            
            <Text style={styles.label}>Birth date</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} />
            
            <Text style={styles.label}>Type</Text>
            <TextInput style={styles.input} value={type} onChangeText={setType} />
            
            <TouchableOpacity style={styles.submitButton} onPress={() => onSave({ name, birthDate, type })}>
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
    submitButton: { backgroundColor: '#333', padding: 15, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});