import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditOwnerForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Owner</Text>
            
            <Text style={styles.label}>First name</Text>
            <TextInput style={styles.input} value={formData.firstName} onChangeText={(v) => handleChange('firstName', v)} />
            
            <Text style={styles.label}>Last name</Text>
            <TextInput style={styles.input} value={formData.lastName} onChangeText={(v) => handleChange('lastName', v)} />
            
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={formData.address} onChangeText={(v) => handleChange('address', v)} />
            
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={formData.city} onChangeText={(v) => handleChange('city', v)} />
            
            <Text style={styles.label}>Telephone</Text>
            <TextInput style={styles.input} value={formData.telephone} keyboardType="phone-pad" onChangeText={(v) => handleChange('telephone', v)} />
            
            <TouchableOpacity style={styles.submitButton} onPress={() => onSave(formData)}>
                <Text style={styles.buttonText}>Submit</Text>
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