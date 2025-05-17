import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import WishlistScreen from '../screens/WishlistScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EventSpaceScreen from '../screens/EventSpaceScreen';
import EventSpaceDetailScreen from '../screens/EventSpaceDetailScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import AllEventsScreen from '../screens/AllEventsScreen';
import AllServicesScreen from '../screens/AllServicesScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ChatScreen from '../screens/ChatScreen';
import { useTheme } from '../context/ThemeContext';
import { CommonActions } from '@react-navigation/native';
import NotificationBadge from '../components/NotificationBadge';
import { View } from 'react-native';
import api from '../configs/api';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
};

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name="AllEvents" 
        component={AllEventsScreen} 
        options={{ title: 'All Events' }}
      />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen} 
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen 
        name="CreateEvent" 
        component={CreateEventScreen} 
        options={{ title: 'Create Event' }}
      />
    </Stack.Navigator>
  );
}

// Event Spaces Stack Navigator
function EventSpacesStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen 
        name="EventSpacesMain" 
        component={EventSpaceScreen} 
        options={{ title: 'Event Spaces' }}
      />
      <Stack.Screen 
        name="EventSpaceDetails" 
        component={EventSpaceDetailScreen} 
        options={{ title: 'Space Details' }}
      />
    </Stack.Navigator>
  );
}

// Services Stack Navigator
function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen 
        name="AllServicesScreen" 
        component={AllServicesScreen} 
        options={{ title: 'All Services' }}
      />
      <Stack.Screen 
        name="ServicesMain" 
        component={ServicesScreen} 
        options={{ title: 'Services' }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailScreen} 
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
const MainTabs = () => {
  const { theme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get(`/chat/unread/${auth.currentUser?.uid}`);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    // Set up polling for unread count
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'EventSpacesTab') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'ServicesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Messages' && <NotificationBadge count={unreadCount} />}
            </View>
          );
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
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="EventSpacesTab" 
        component={EventSpacesStack}
        options={{ title: 'Spaces' }}
      />
      <Tab.Screen 
        name="ServicesTab" 
        component={ServicesStack}
        options={{ title: 'Services' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
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
        name="Chat" 
        component={ChatScreen}
        options={{
          headerShown: true,
          title: 'Chat'
        }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Payment' }}
      />
    </Stack.Navigator>
  );
}

export default RootStack;
 