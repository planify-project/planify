import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import AuthNavigator from './navigation/AuthNavigator';


export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  )
}