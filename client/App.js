import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllEventsScreen from './screens/AllEventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App.js rendered - navigation stack loaded');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AllEvents">
        <Stack.Screen
          name="AllEvents"
          component={AllEventsScreen}
          options={{ title: 'All Events', headerShown: false }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
