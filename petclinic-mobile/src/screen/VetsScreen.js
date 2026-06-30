import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const mockVets = [
    { id: '1', name: 'James Carter', specialties: 'none' },
    { id: '2', name: 'Helen Leary', specialties: 'radiology' },
    { id: '3', name: 'Linda Douglas', specialties: 'dentistry, surgery' },
    { id: '4', name: 'Rafael Ortega', specialties: 'surgery' },
    { id: '5', name: 'Henry Stevens', specialties: 'radiology' },
    { id: '6', name: 'Sharon Jenkins', specialties: 'none' },
];

export default function VetsScreen() {
    const renderVetCard = ({ item }) => (
        <SafeAreaView style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            {item.specialties !== 'none' ? (
                <Text style={styles.specialty}>🩺 {item.specialties}</Text>
            ) : (
                <Text style={styles.noSpecialty}>General Practice</Text>
            )}
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={mockVets}
                keyExtractor={(item) => item.id}
                renderItem={renderVetCard}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    listContainer: { padding: 15 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50', 
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    specialty: { fontSize: 14, color: '#555', marginTop: 5, textTransform: 'capitalize' },
    noSpecialty: { fontSize: 14, color: '#999', marginTop: 5, fontStyle: 'italic' }
});