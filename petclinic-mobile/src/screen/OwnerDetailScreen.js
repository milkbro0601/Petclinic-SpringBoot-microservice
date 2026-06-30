import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import EditOwnerForm from '../components/form/EditOwnerForm';
import AddPetForm from '../components/form/AddPetForm';
import EditPetForm from '../components/form/EditPetForm';
import AddVisitForm from '../components/form/AddVisitForm';
import { updateOwner, addPet, updatePet, addVisit, getOwnerById } from '../service/api';

export default function OwnerDetailsScreen({ route, navigation }) {
    const [owner, setOwner] = useState(route.params.owner);
    const [activeForm, setActiveForm] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [saving, setSaving] = useState(false);

    const refreshOwner = async () => {
        try {
            const response = await getOwnerById(owner.id);
            setOwner(response.data);
        } catch (err) {
            console.log('Failed to refresh owner', err);
        }
    };

    const handleEditOwner = async (data) => {
        try {
            setSaving(true);
            console.log('Updating owner with data:', data);
            const response = await updateOwner(owner.id, data);
            console.log('Update response:', response.status);
            await refreshOwner();
            setActiveForm(null);
            Alert.alert('Success', 'Owner updated successfully');
        } catch (err) {
            console.log('Update error:', err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update owner');
        } finally {
            setSaving(false);
        }
    };

    const handleAddPet = async (data) => {
        try {
            setSaving(true);
            console.log('Adding pet with data:', data);
            const response = await addPet(owner.id, data);
            console.log('Add pet response:', response.status, response.data);
            await refreshOwner();
            setActiveForm(null);
            Alert.alert('Success', 'Pet added successfully');
        } catch (err) {
            console.log('Add pet error:', err.response?.status, err.response?.data || err.message);
            Alert.alert('Error', 'Failed to add pet');
        } finally {
            setSaving(false);
        }
    };

    const handleEditPet = async (data) => {
        try {
            setSaving(true);
            await updatePet(selectedPet.id, data);
            await refreshOwner();
            setActiveForm(null);
            Alert.alert('Success', 'Pet updated successfully');
        } catch (err) {
            Alert.alert('Error', 'Failed to update pet');
            console.log(err);
        } finally {
            setSaving(false);
        }
    };

   const handleAddVisit = async (data) => {
        try {
            setSaving(true);
            console.log('Adding visit with data:', data, 'for petId:', selectedPet.id);
            const response = await addVisit(selectedPet.id, data);
            console.log('Add visit response:', response.status, response.data);
            setActiveForm(null);
            Alert.alert('Success', 'Visit added successfully');
        } catch (err) {
            console.log('Add visit error:', err.response?.status, err.response?.data || err.message);
            Alert.alert('Error', 'Failed to add visit');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Owner Information Section */}
            <View style={styles.section}>
                {activeForm === 'editOwner' ? (
                    <EditOwnerForm
                        initialData={{
                            firstName: owner.firstName,
                            lastName: owner.lastName,
                            address: owner.address,
                            city: owner.city,
                            telephone: owner.telephone
                        }}
                        onSave={handleEditOwner}
                        onCancel={() => setActiveForm(null)}
                    />
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Owner Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Name:</Text>
                            <Text style={styles.value}>{owner.firstName} {owner.lastName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Address:</Text>
                            <Text style={styles.value}>{owner.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>City:</Text>
                            <Text style={styles.value}>{owner.city}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Telephone:</Text>
                            <Text style={styles.value}>{owner.telephone}</Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.btn} onPress={() => setActiveForm('editOwner')}>
                                <Text style={styles.btnText}>Edit Owner</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={() => setActiveForm('addPet')}>
                                <Text style={styles.btnText}>Add New Pet</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {/* Pets and Visits Section */}
            <View style={styles.section}>
                {activeForm === 'addPet' && (
                    <AddPetForm onSave={handleAddPet} onCancel={() => setActiveForm(null)} />
                )}
                {activeForm === 'editPet' && selectedPet && (
                    <EditPetForm
                        initialData={{
                            name: selectedPet.name,
                            birthDate: selectedPet.birthDate,
                            type: selectedPet.type?.name || ''
                        }}
                        onSave={handleEditPet}
                        onCancel={() => setActiveForm(null)}
                    />
                )}
                {activeForm === 'addVisit' && (
                    <AddVisitForm onSave={handleAddVisit} />
                )}

                {activeForm === null && (
                    <>
                        <Text style={styles.sectionTitle}>Pets and Visits</Text>

                        {owner.pets && owner.pets.length > 0 ? (
                            owner.pets.map((pet) => (
                                <View key={pet.id} style={styles.petBlock}>
                                    <Text style={styles.petName}>
                                        {pet.name} ({pet.type?.name || 'Unknown'})
                                    </Text>
                                    <Text style={styles.subText}>
                                        Birth Date: {pet.birthDate}
                                    </Text>

                                    <View style={styles.visitContainer}>
                                        <TouchableOpacity onPress={() => {
                                            setSelectedPet(pet);
                                            setActiveForm('addVisit');
                                        }}>
                                            <Text style={styles.link}>+ Add Visit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setSelectedPet(pet);
                                            setActiveForm('editPet');
                                        }}>
                                            <Text style={styles.link}>Edit Pet</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.subText}>No pets found</Text>
                        )}
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
    section: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    infoRow: { flexDirection: 'row', marginBottom: 10 },
    label: { fontWeight: 'bold', width: 100 },
    value: { flex: 1 },
    buttonRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
    btn: { backgroundColor: '#333', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center' },
    secondaryBtn: { backgroundColor: '#4CAF50' },
    btnText: { color: '#fff', fontWeight: 'bold' },
    petBlock: { marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#eee' },
    petName: { fontWeight: 'bold', fontSize: 16, color: '#4CAF50' },
    subText: { marginBottom: 10, color: '#666' },
    visitContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15, marginTop: 5 },
    link: { color: '#2196F3', fontWeight: 'bold' },
});