import { useContext, useEffect } from 'react';
import { NavigationContainer, useNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Toast from './components/Toast';

import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from './config';

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
import AllEventsScreen from './screens/AllEventsScreen';
import AllServicesScreen from './screens/AllServicesScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import JoinEventScreen from './screens/JoinEventScreen';
import AboutScreen from './screens/AboutScreen';
import HelpScreen from './screens/HelpScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import ReviewScreen from './screens/ReviewScreen';
import EventSpaceScreen from './screens/EventSpaceScreen';
import EventSpaceDetails from './screens/EventSpaceDetails';
import PaymentScreen from './screens/PaymentScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ProfileScreen from './screens/ProfileScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import PaymentFailureScreen from './screens/PaymentFailureScreen';
import FullScreenMap from './screens/FullScreenMap';
import MyServicesScreen from './screens/MyServicesScreen';
import ServicesScreen from './screens/ServicesScreen';
import NearbyEventsScreen from './screens/NearbyEventsScreen';
import MessagesScreen from './screens/MessagesScreen';

import { AuthProvider, AuthContext, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import ChatScreen from './screens/ChatScreen';
import { initializeSocket, disconnectSocket } from './utils/socket';

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenHeaderOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
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

const headerOptions = {
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
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/homelogo3.png')}
              style={{ width: 130, height: 80, resizeMode: 'contain', marginLeft: -5 }}
            />
          ),
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#22223B',
        }}
      />
      <Stack.Screen
        name="NearbyEvents"
        component={NearbyEventsScreen}
        options={{
          headerShown: true,
          headerTitle: "Nearby Events",
          headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="EventSpaces"
        component={EventSpaceScreen}
        options={{
          headerShown: true,
          headerTitle: "Event Spaces",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="EventSpaceDetails"
        component={EventSpaceDetails}
        options={{
          headerShown: true,
          headerTitle: "Space Details",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerTitle: "Notifications",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ ...headerOptions, headerTitle: "Messages" }}
      />
      <Stack.Screen
        name="Popular Events"
        component={PopularEventsScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="AllEvents"
        component={AllEventsScreen}
        options={{
          headerShown: true,
          headerTitle: "All Events",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="JoinEvent"
        component={JoinEventWrapper}
        options={{ ...screenHeaderOptions, title: 'Join Event' }}
      />
      <Stack.Screen
        name="AllServices"
        component={AllServicesScreen}
        options={{
          headerShown: true,
          headerTitle: "All Services",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          headerShown: true,
          headerTitle: "Add New Service",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Service Details",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          headerShown: true,
          headerTitle: "Write a Review",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="ServicesScreen"
        component={ServicesScreen}
        options={{ ...headerOptions, title: 'Services' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Event Details",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
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
        options={headerOptions}
      />
      <Stack.Screen
        name="Popular Events"
        component={PopularEventsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllEvents"
        component={AllEventsScreen}
        options={{
          headerShown: true,
          headerTitle: "All Events",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
    </Stack.Navigator>
  );
}

// Wishlist Stack
function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
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
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: "My Profile",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="MyServices"
        component={MyServicesScreen}
        options={{
          headerShown: true,
          headerTitle: "My Services",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{
          headerShown: true,
          headerTitle: "Edit Service",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
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
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
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
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
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
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
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
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
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
          headerTitle: "All Services",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailScreen}
        options={{
          headerShown: true,
          headerTitle: "Service Details",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          headerShown: true,
          headerTitle: "Add New Service",
          headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
        }}
      />
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
          } else if (route.name === 'Services') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C6FD1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Services" component={ServicesStack} />
      <Tab.Screen name="Wishlist" component={WishlistStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

const AppContent = () => {
  const { user } = useAuth();
  const { toast, hideToast } = useNotifications();

  useEffect(() => {
    if (user) {
      initializeSocket(user.id);
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={MainTabs} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            headerShown: true,
            headerTitle: "Payment",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccessScreen}
          options={{
            headerShown: true,
            headerTitle: "Payment Success",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="PaymentFailure"
          component={PaymentFailureScreen}
          options={{
            headerShown: true,
            headerTitle: "Payment Failed",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => {
            console.log('Chat Screen Route Params:', route.params);
            return {
              headerShown: true,
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{
                      uri: route.params?.recipientProfilePic || 'https://via.placeholder.com/40',
                      cache: 'reload'
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                      backgroundColor: '#f0f0f0'
                    }}
                    onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                  />
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    {route.params?.recipientName || 'Chat'}
                  </Text>
                </View>
              ),
              headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
            };
          }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{
            headerShown: true,
            headerTitle: "Event Details",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="FullScreenMap"
          component={FullScreenMap}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal'
          }}
        />
        <Stack.Screen
          name="AllEvents"
          component={AllEventsScreen}
          options={{
            headerShown: true,
            headerTitle: "All Events",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="JoinEvent"
          component={JoinEventWrapper}
          options={{
            headerShown: true,
            headerTitle: "Join Event",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="Review"
          component={ReviewScreen}
          options={{
            headerShown: true,
            headerTitle: "Write a Review",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: true,
            headerTitle: "Edit Profile",
            headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerShown: true,
            headerTitle: "Chat",
            headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="AllServices"
          component={AllServicesScreen}
          options={{
            headerShown: true,
            headerTitle: "All Services",
            headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="AddService"
          component={AddServiceScreen}
          options={{
            headerShown: true,
            headerTitle: "Add Service",
            headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{
            headerShown: true,
            headerTitle: "Service Details",
            headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          }}
        />
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
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        console.warn('No internet connection. Some features may be limited.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <ThemeProvider>
          <SocketProvider>
            <NotificationProvider>
              <AuthProvider>
                <WishlistProvider>
                  <AppContent />
                </WishlistProvider>
              </AuthProvider>
            </NotificationProvider>
          </SocketProvider>
        </ThemeProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
