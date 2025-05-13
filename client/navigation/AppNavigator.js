import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import WishlistScreen from '../screens/WishlistScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import { useTheme } from '../context/ThemeContext';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
};

// Root Stack Navigator
function RootStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event Details' }}
      />
    </Stack.Navigator>
  );
}

const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5D5FEE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default RootStack;
