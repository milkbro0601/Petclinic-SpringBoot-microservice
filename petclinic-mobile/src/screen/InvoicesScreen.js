import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';

const mockInvoices = [
    { id: '1', date: '2026-06-29', total: 'RM 80', status: 'PENDING', ownerId: '1', petId: '1' },
    { id: '2', date: '2026-06-28', total: 'RM 120', status: 'PAID', ownerId: '3', petId: '4' },
];

export default function InvoicesScreen() {
    const [isCreating, setIsCreating] = useState(false);

    const renderInvoice = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.date}>📅 {item.date}</Text>
                <Text style={[styles.statusBadge, item.status === 'PAID' ? styles.statusPaid : styles.statusPending]}>{item.status}</Text>
            </View>
            <View style={styles.detailsRow}>
                <Text style={styles.detailsText}>Owner ID: {item.ownerId}</Text>
                <Text style={styles.detailsText}>Pet ID: {item.petId}</Text>
            </View>
            <View style={styles.footerRow}>
                <Text style={styles.total}>{item.total}</Text>
                {item.status === 'PENDING' && (
                    <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>Mark Paid</Text></TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {isCreating ? (
                <ScrollView style={styles.container}>
                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>New Invoice</Text>
                        <Text style={styles.label}>Select Owner</Text>
                        <TextInput style={styles.input} placeholder="-- Select Owner --" />
                        
                        <Text style={styles.sectionTitle}>Treatments</Text>
                        <View style={styles.row}>
                            <TextInput style={[styles.input, { flex: 2 }]} placeholder="Treatment" />
                            <TextInput style={[styles.input, { flex: 1, marginLeft: 10 }]} placeholder="1" keyboardType="numeric" />
                            <TouchableOpacity style={styles.addButton}><Text style={styles.btnText}>Add</Text></TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>Medicines</Text>
                        <View style={styles.row}>
                            <TextInput style={[styles.input, { flex: 2 }]} placeholder="Medicine" />
                            <TextInput style={[styles.input, { flex: 1, marginLeft: 10 }]} placeholder="1" keyboardType="numeric" />
                            <TouchableOpacity style={styles.addButton}><Text style={styles.btnText}>Add</Text></TouchableOpacity>
                        </View>

                        <Text style={styles.total}>Total: RM 0.00</Text>
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745' }]} onPress={() => setIsCreating(false)}><Text style={styles.actionButtonText}>Create Invoice</Text></TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 10, padding: 10 }} onPress={() => setIsCreating(false)}><Text>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <>
                    <TouchableOpacity style={styles.createButton} onPress={() => setIsCreating(true)}>
                        <Text style={styles.createButtonText}>+ Create Invoice</Text>
                    </TouchableOpacity>
                    <FlatList data={mockInvoices} keyExtractor={(item) => item.id} renderItem={renderInvoice} contentContainerStyle={styles.listContainer} />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    createButton: { backgroundColor: '#4CAF50', padding: 15, margin: 15, borderRadius: 8, alignItems: 'center' },
    createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    listContainer: { paddingHorizontal: 15, paddingBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, marginBottom: 12, borderRadius: 8, elevation: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    date: { fontSize: 16, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontWeight: 'bold' },
    statusPaid: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
    statusPending: { backgroundColor: '#FFF3E0', color: '#EF6C00' },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
    total: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    actionButton: { backgroundColor: '#388E3C', padding: 10, borderRadius: 5 },
    actionButtonText: { color: '#fff', fontWeight: 'bold' },
    formContainer: { padding: 20, backgroundColor: '#fff', margin: 15, borderRadius: 8 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginTop: 5 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
    label: { marginTop: 10 },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    addButton: { backgroundColor: '#333', padding: 10, marginLeft: 10, borderRadius: 5 },
    btnText: { color: '#fff' },
    btnRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 }
});