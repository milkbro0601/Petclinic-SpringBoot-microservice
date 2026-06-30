import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';

// Mock data based on your desktop web screenshot
const mockOwners = [
    { id: '1', name: 'George Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: 'Leo' },
    { id: '2', name: 'Betty Davis', address: '638 Cardinal Ave.', city: 'Sun Prairie', telephone: '6085551749', pets: 'Basil' },
    { id: '3', name: 'Eduardo Rodriquez', address: '2693 Commerce St.', city: 'McFarland', telephone: '6085558763', pets: 'Jewel, Rosy' },
    { id: '4', name: 'Harold Davis', address: '563 Friendly St.', city: 'Windsor', telephone: '6085553198', pets: 'Iggy' },
];

export default function OwnersScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [owners] = useState(mockOwners);
    const navigation = useNavigation();

    const filteredOwners = owners.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderOwnerCard = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OwnerDetails', { owner: item })}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>📍 {item.address}, {item.city}</Text>
            <Text style={styles.detail}>📞 {item.telephone}</Text>
            <Text style={styles.pets}>🐾 Pets: {item.pets}</Text>
        </TouchableOpacity>
    );

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
                keyExtractor={(item) => item.id}
                renderItem={renderOwnerCard}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    listContainer: { 
        paddingHorizontal: 15, 
        paddingBottom: 20 
    },
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
    name: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 8 
    },
    detail: { 
        fontSize: 14, 
        color: '#555', 
        marginBottom: 4 
    },
    pets: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#4CAF50', 
        marginTop: 6 
    },
});