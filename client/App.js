import React, { useContext, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import PopularEventsScreen from './screens/PopularEventsScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import WishlistScreen from './screens/WishlistScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthNavigator from './navigation/AuthNavigator';
import NotificationScreen from './screens/NotificationScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import JoinEventScreen from './screens/JoinEventScreen';
import AgentChatScreen from './screens/AgentChatScreen';
import AgentListScreen from './screens/AgentsListScreen';
import AgentProfileScreen from './screens/AgentProfileScreen';
import AllEventsScreen from './screens/AllEventsScreen';

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
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="Popular Events"
        component={PopularEventsScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="JoinEvent"
        component={JoinEventWrapper}
        options={{ ...screenHeaderOptions, title: 'Join Event' }}
      />
      <Stack.Screen
        name="Agent Chat"
        component={AgentChatScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="Agent List"
        component={AgentListScreen}
        options={screenHeaderOptions}
      />
      <Stack.Screen
        name="AgentProfile"
        component={AgentProfileScreen}
        options={{ ...screenHeaderOptions, title: "Agent Profile" }}
      />
      <Stack.Screen
        name="AllEvents"
        component={AllEventsScreen}
        options={{ ...screenHeaderOptions, title: 'All Events' }}
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
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={screenHeaderOptions} 
      />
    </Stack.Navigator>
  );
}

// Main Tabs Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home-outline'; break;
            case 'Schedule': iconName = 'calendar-outline'; break;
            case 'Wishlist': iconName = 'heart-outline'; break;
            case 'Settings': iconName = 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Wishlist" component={WishlistStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
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
  );
}
