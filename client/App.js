import React, { useContext, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './context/ThemeContext';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Enable screens for better performance
enableScreens();

// Screens
import PopularEventsScreen from './screens/PopularEventsScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import WishlistScreen from './screens/WishlistScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthNavigator from './navigation/AuthNavigator';
import NotificationScreen from './screens/NotificationScreen';
import AddServiceScreen from './screens/AddServiceScreen';
import EditServiceScreen from './screens/EditServiceScreen';
import AllEventsScreen from './screens/NearbyEventScreen';
import AllServicesScreen from './screens/AllServicesScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import JoinEventScreen from './screens/JoinEventScreen';
import AgentChatScreen from './screens/AgentChatScreen';
import AgentListScreen from './screens/AgentsListScreen';
import AgentProfileScreen from './screens/AgentProfileScreen';
import AboutScreen from './screens/AboutScreen';
import HelpScreen from './screens/HelpScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';

import { AuthProvider, AuthContext } from './context/AuthContext';

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
};


function JoinEventWrapper(props) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.replace('Auth');
    }
  }, [user]);

  if (!user) return null;
  return <JoinEventScreen {...props} />;
}

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={screenHeaderOptions}
      />
    </Stack.Navigator>
  );
}

// Schedule Stack
function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="Popular Events"
        component={PopularEventsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
}

// Wishlist Stack
function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

// Settings Stack
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={screenHeaderOptions} />
      <Stack.Screen 
        name="EditService" 
        component={EditServiceScreen} 
        options={{
          headerShown: true,
          headerTitle: "Edit Service",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} 
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{
          headerShown: true,
          headerTitle: "About",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} 
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen} 
        options={{
          headerShown: true,
          headerTitle: "Help & Support",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} 
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen} 
        options={{
          headerShown: true,
          headerTitle: "Privacy Policy",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} 
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{
          headerShown: true,
          headerTitle: "Notifications",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} 
      />
    </Stack.Navigator>
  );
}

// Services Stack
function ServicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AllServices" 
        component={AllServicesScreen} 
        options={{
          headerShown: true,
          headerTitle: "My Services",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} 
      />
    </Stack.Navigator>
  );
}

// Main Tabs Navigator
function MainTabs() {
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
        tabBarShowLabel: false, // <-- Add this line to hide labels
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Schedule" component={ScheduleStack} options={{ headerShown: false }} />
      <Tab.Screen name="Wishlist" component={WishlistStack} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="Root" 
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Auth" 
                component={AuthNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
