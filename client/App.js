import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './context/ThemeContext';



// Screens
import AllEventsScreen from './screens/NearbyEventScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import PopularEventsScreen from './screens/PopularEventsScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import WishlistScreen from './screens/WishlistScreen';
import SettingsScreen from './screens/SettingsScreen';
import AuthNavigator from './navigation/AuthNavigator';
import NotificationScreen from './screens/NotificationScreen';
import AgentChatScreen from './screens/AgentChatScreen';
import AgentListScreen from './screens/AgentsListScreen';
import AgentProfileScreen from './screens/AgentProfileScreen';

// Navigators
const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
};

// Home Stack
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
        options={{
          headerShown: true,
          headerTitle: "Nearby Events",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
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
        name="Popular Events"
        component={PopularEventsScreen}
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
      <Stack.Screen
        name="Agent Chat"
        component={AgentChatScreen}
        options={{ headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 } }}
      />
      <Stack.Screen
        name="Agent List"
        component={AgentListScreen}
        options={{ headerShown: true,
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 } }}
      />
      <Stack.Screen
        name="AgentProfile"
        component={AgentProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "Agent Profile",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
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

// Stack Navigator for Calendar


// Settings Stack
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={screenHeaderOptions} />
    </Stack.Navigator>
  );
}

// Main Bottom Tabs
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

// App Component
export default function App() {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
    </ThemeProvider>
  );
}