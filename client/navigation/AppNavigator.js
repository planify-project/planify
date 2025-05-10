import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EventSpaceScreen from '../screens/EventSpaceScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventSpaces"
        component={EventSpaceScreen}
        options={{
          title: 'Event Spaces',
          headerStyle: {
            backgroundColor: '#5D5FEE',
          },
          headerTintColor: '#fff',
        }}
      />
      {/* ...other screens... */}
    </Stack.Navigator>
  );
}

// In HomeTabs.js
const handleTabPress = (index) => {
  console.log('Tab pressed:', index);
  console.log('Navigation prop:', navigation);
  onTabPress(index);
  if (index === 1) {
    navigation?.navigate('EventSpaces');
  }
};
