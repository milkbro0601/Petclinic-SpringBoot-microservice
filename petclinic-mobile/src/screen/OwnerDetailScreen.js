import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import EditOwnerForm from '../components/form/EditOwnerForm'; 
import AddPetForm from '../components/form/AddPetForm';
import EditPetForm from '../components/form/EditPetForm';
import AddVisitForm from '../components/form/AddVisitForm';

export default function OwnerDetailsScreen({ route }) {
    const { owner } = route.params;
    const [activeForm, setActiveForm] = useState(null);

    return (
        <ScrollView style={styles.container}>
            {/* Owner Information Section */}
            <View style={styles.section}>
                {activeForm === 'editOwner' ? (
                    <EditOwnerForm 
                        initialData={{
                            firstName: owner.name.split(' ')[0], 
                            lastName: owner.name.split(' ')[1] || '',
                            address: owner.address,
                            city: 'Madison',
                            telephone: owner.phone
                        }}
                        onSave={(data) => { console.log(data); setActiveForm(null); }}
                        onCancel={() => setActiveForm(null)}
                    />
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Owner Information</Text>
                        <View style={styles.infoRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{owner.name}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Address:</Text><Text style={styles.value}>{owner.address}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>City:</Text><Text style={styles.value}>Madison</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Telephone:</Text><Text style={styles.value}>{owner.phone}</Text></View>
                        
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.btn} onPress={() => setActiveForm('editOwner')}><Text style={styles.btnText}>Edit Owner</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={() => setActiveForm('addPet')}><Text style={styles.btnText}>Add New Pet</Text></TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {/* Pets and Visits Section */}
            <View style={styles.section}>
                {activeForm === 'addPet' && <AddPetForm onSave={() => setActiveForm(null)} onCancel={() => setActiveForm(null)} />}
                {activeForm === 'editPet' && (
                    <EditPetForm 
                        initialData={{ name: 'Leo', birthDate: '2010-09-07', type: 'cat' }} 
                        onSave={(data) => { console.log('Saved:', data); setActiveForm(null); }} 
                        onCancel={() => setActiveForm(null)}
                    />
                )}                
                {activeForm === 'addVisit' && <AddVisitForm onSave={() => setActiveForm(null)} />}

                {activeForm === null && (
                    <>
                        <Text style={styles.sectionTitle}>Pets and Visits</Text>
                        <Text style={styles.petName}>Leo (cat)</Text>
                        <Text style={styles.subText}>Birth Date: 2010 Sep 07</Text>
                        
                        <View style={styles.visitContainer}>
                            <Text style={styles.visitText}>2026 Jun 20 - annual checkup</Text>
                            <TouchableOpacity onPress={() => setActiveForm('editPet')}>
                                
                                <Text style={styles.link}>Edit Pet</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.addVisitButton} onPress={() => setActiveForm('addVisit')}>
                            <Text style={styles.addVisitButtonText}>+ Add New Visit</Text>
                        </TouchableOpacity>
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
     petName: { fontWeight: 'bold', fontSize: 16, color: '#4CAF50' },
     subText: { marginBottom: 10 },
     visitContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
     visitText: { color: '#333' },
     link: { color: '#2196F3', fontWeight: 'bold' },
     addVisitButton: { 
         marginTop: 15, 
         padding: 12, 
         backgroundColor: '#f0f0f0', 
         borderRadius: 5, 
         borderWidth: 1, 
         borderColor: '#ddd',
         alignItems: 'center' 
     },
     addVisitButtonText: { color: '#333', fontWeight: 'bold' }
});

