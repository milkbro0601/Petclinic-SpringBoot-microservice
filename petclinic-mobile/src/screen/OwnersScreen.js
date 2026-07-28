import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getOwners } from '../service/api';

export default function OwnersScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            setLoading(true);
            const response = await getOwners();
            setOwners(response.data);
        } catch (err) {
            setError('Failed to load owners');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOwners = owners.filter((item) =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderOwnerCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OwnerDetails', { owner: item })}>
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.detail}>📍 {item.address}, {item.city}</Text>
            <Text style={styles.detail}>📞 {item.telephone}</Text>
            <Text style={styles.pets}>
                🐾 Pets: {item.pets && item.pets.length > 0
                    ? item.pets.map(p => p.name).join(', ')
                    : 'None'}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchOwners}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Filter..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
            <FlatList
                data={filteredOwners}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOwnerCard}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16, marginBottom: 10 },
    retryBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8 },
    retryText: { color: '#fff', fontWeight: 'bold' },
    searchInput: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    detail: { fontSize: 14, color: '#555', marginBottom: 4 },
    pets: { fontSize: 14, fontWeight: '600', color: '#4CAF50', marginTop: 6 },
});