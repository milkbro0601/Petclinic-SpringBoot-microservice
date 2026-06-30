import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const mockSummary = {
    totalVisitsToday: 1,
    totalVisitsThisMonth: 5,
    totalVisitsThisYear: 9,
    totalVisitsAllTime: 9,
    busiestMonth: 'June',
    busiestDay: 'Thursday'
};

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🐾 PetClinic</Text>
                <Text style={styles.headerSubtitle}>Dashboard</Text>
            </View>

            {/* Summary Cards */}
            <Text style={styles.sectionTitle}>📊 Visit Summary</Text>
            <View style={styles.cardRow}>
                <View style={[styles.card, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.cardNumber}>{mockSummary.totalVisitsToday}</Text>
                    <Text style={styles.cardLabel}>Today</Text>
                </View>
                <View style={[styles.card, { backgroundColor: '#2196F3' }]}>
                    <Text style={styles.cardNumber}>{mockSummary.totalVisitsThisMonth}</Text>
                    <Text style={styles.cardLabel}>This Month</Text>
                </View>
            </View>
            <View style={styles.cardRow}>
                <View style={[styles.card, { backgroundColor: '#FF9800' }]}>
                    <Text style={styles.cardNumber}>{mockSummary.totalVisitsThisYear}</Text>
                    <Text style={styles.cardLabel}>This Year</Text>
                </View>
                <View style={[styles.card, { backgroundColor: '#9C27B0' }]}>
                    <Text style={styles.cardNumber}>{mockSummary.totalVisitsAllTime}</Text>
                    <Text style={styles.cardLabel}>All Time</Text>
                </View>
            </View>

            {/* Busiest Info */}
            <Text style={styles.sectionTitle}>📈 Statistics</Text>
            <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>🗓 Busiest Month</Text>
                    <Text style={styles.infoValue}>{mockSummary.busiestMonth}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>📅 Busiest Day</Text>
                    <Text style={styles.infoValue}>{mockSummary.busiestDay}</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
            <View style={styles.cardRow}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Owners')}>
                    <Text style={styles.actionIcon}>👥</Text>
                    <Text style={styles.actionLabel}>Owners</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Vets')}>
                    <Text style={styles.actionIcon}>👨‍⚕️</Text>
                    <Text style={styles.actionLabel}>Vets</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.cardRow, { marginBottom: 30 }]}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Invoices')}>
                    <Text style={styles.actionIcon}>🧾</Text>
                    <Text style={styles.actionLabel}>Invoices</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Reports')}>
                    <Text style={styles.actionIcon}>📊</Text>
                    <Text style={styles.actionLabel}>Reports</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#4CAF50',
        padding: 30,
        paddingTop: 50,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    cardRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 10,
        marginBottom: 10,
    },
    card: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardLabel: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        marginTop: 5,
    },
    infoBox: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 15,
        color: '#666',
    },
    infoValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    actionBtn: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    actionIcon: {
        fontSize: 30,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
});