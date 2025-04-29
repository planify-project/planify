import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// Screens
import AllEventsScreen from './screens/AllEventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import PopularEventsScreen from './screens/PopularEventsScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import WishlistScreen from './screens/WishlistScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationScreen from './screens/NotificationScreen';


// Stack and Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Home
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="AllEvents"
        component={AllEventsScreen}
        options={{ headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 } }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 } }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 } }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Schedule (shows PopularEvents)
function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="Popular Events"
        component={PopularEventsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Wishlist
function WishlistStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
      }}
    >
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  )
}

// Stack Navigator for Settings
function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }} />
    </Stack.Navigator>
  )
}

// Main App
export default function App() {
  console.log('App.js rendered - navigation stack loaded');

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Schedule') {
              iconName = 'calendar-outline';
            } else if (route.name === 'Wishlist') {
              iconName = 'heart-outline';
            } else if (route.name === 'Settings') {
              iconName = 'person-outline';
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
    </NavigationContainer>
  );
}
