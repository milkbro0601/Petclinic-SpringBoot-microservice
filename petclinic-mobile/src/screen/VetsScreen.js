import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getVets } from '../service/api';

export default function VetsScreen() {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        try {
            setLoading(true);
            const response = await getVets();
            setVets(response.data);
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to load vets');
        } finally {
            setLoading(false);
        }
    };

    const renderVetCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            {item.specialties && item.specialties.length > 0 ? (
                <Text style={styles.specialty}>
                    🩺 {item.specialties.map(s => s.name).join(', ')}
                </Text>
            ) : (
                <Text style={styles.noSpecialty}>General Practice</Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={vets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderVetCard}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 15 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    specialty: { fontSize: 14, color: '#555', marginTop: 5, textTransform: 'capitalize' },
    noSpecialty: { fontSize: 14, color: '#999', marginTop: 5, fontStyle: 'italic' }
});