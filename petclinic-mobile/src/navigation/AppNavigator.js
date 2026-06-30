import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screen/HomeScreen';
import OwnersScreen from '../screen/OwnersScreen';
import OwnerDetailScreen from '../screen/OwnerDetailScreen';
import VetsScreen from '../screen/VetsScreen';
import TreatmentsScreen from '../screen/TreatmentsScreen';
import InvoicesScreen from '../screen/InvoicesScreen';
import ReportsScreen from '../screen/ReportsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const OwnersStack = createNativeStackNavigator();

function OwnersStackScreen() {
    return (
        <OwnersStack.Navigator>
            <OwnersStack.Screen name="OwnersList" component={OwnersScreen} options={{ headerShown: false }} />
            <OwnersStack.Screen name="OwnerDetails" component={OwnerDetailScreen} />
        </OwnersStack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#4CAF50',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: true
                }}>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>
                    }} />
                <Tab.Screen
                    name="Owners"
                    component={OwnersStackScreen}
                    options={{
                        tabBarLabel: 'Owners',
                        tabBarIcon: ({ color }) => <Text style={{ color }}>👥</Text>
                    }} />
                <Tab.Screen
                    name="Vets"
                    component={VetsScreen}
                    options={{
                        tabBarLabel: 'Vets',
                        tabBarIcon: ({ color }) => <Text style={{ color }}>👨‍⚕️</Text>
                    }} />
                <Tab.Screen
                    name="Treatments"
                    component={TreatmentsScreen}
                    options={{
                        tabBarLabel: 'Treatments',
                        tabBarIcon: ({ color }) => <Text style={{ color }}>💊</Text>
                    }} />
                <Tab.Screen
                    name="Invoices"
                    component={InvoicesScreen}
                    options={{
                        tabBarLabel: 'Invoices',
                        tabBarIcon: ({ color }) => <Text style={{ color }}>🧾</Text>
                    }} />
                <Tab.Screen
                    name="Reports"
                    component={ReportsScreen}
                    options={{
                        tabBarLabel: 'Reports',
                        tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text>
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}