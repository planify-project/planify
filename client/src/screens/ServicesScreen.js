import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ServiceList from '../components/ServiceList';
import ServiceForm from '../components/ServiceForm';

const Stack = createStackNavigator();

const ServicesScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ServiceList" 
        component={ServiceList}
        options={{ title: 'Services' }}
      />
      <Stack.Screen 
        name="ServiceForm" 
        component={ServiceForm}
        options={({ route }) => ({ 
          title: route.params?.id ? 'Edit Service' : 'New Service'
        })}
      />
    </Stack.Navigator>
  );
};

export default ServicesScreen; 