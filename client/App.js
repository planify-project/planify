import { useContext, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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
import ChatScreen from './screens/ChatScreen';

import { AuthProvider, AuthContext, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { initializeSocket, disconnectSocket } from './utils/socket';

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const defaultHeader = {
  headerShown: true,
  headerStyle: { backgroundColor: '#6C6FD1', height: 80 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
};

const altHeader = {
  headerShown: true,
  headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 22 },
};

function JoinEventWrapper(props) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) navigation.replace('Auth');
  }, [user]);

  if (!user) return null;
  return <JoinEventScreen {...props} />;
}

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
      <Stack.Screen name="NearbyEvents" component={NearbyEventsScreen} options={{ ...defaultHeader, headerTitle: "Nearby Events" }} />
      <Stack.Screen name="EventSpaces" component={EventSpaceScreen} options={{ ...defaultHeader, headerTitle: "Event Spaces" }} />
      <Stack.Screen name="EventSpaceDetails" component={EventSpaceDetails} options={{ ...defaultHeader, headerTitle: "Space Details" }} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={altHeader} />
      <Stack.Screen name="Notifications" component={NotificationScreen} options={{ ...defaultHeader, headerTitle: "Notifications" }} />
      <Stack.Screen name="Messages" component={MessagesScreen} options={{ ...altHeader, headerTitle: "Messages" }} />
      <Stack.Screen name="Popular Events" component={PopularEventsScreen} options={defaultHeader} />
      <Stack.Screen name="AllEvents" component={AllEventsScreen} options={{ ...defaultHeader, headerTitle: "All Events" }} />
      <Stack.Screen name="JoinEvent" component={JoinEventWrapper} options={{ ...defaultHeader, headerTitle: 'Join Event' }} />
      <Stack.Screen name="AllServices" component={AllServicesScreen} options={{ ...defaultHeader, headerTitle: "All Services" }} />
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ ...defaultHeader, headerTitle: "Add New Service" }} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ ...defaultHeader, headerTitle: "Service Details" }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ ...defaultHeader, headerTitle: "Write a Review" }} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} options={{ ...altHeader, headerTitle: 'Services' }} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ ...defaultHeader, headerTitle: "Event Details" }} />
    </Stack.Navigator>
  );
}

// Schedule Stack
function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Schedule" component={ScheduleScreen} options={altHeader} />
      <Stack.Screen name="Popular Events" component={PopularEventsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AllEvents" component={AllEventsScreen} options={{ ...defaultHeader, headerTitle: "All Events" }} />
    </Stack.Navigator>
  );
}

// Wishlist Stack
function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={altHeader}>
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

// Settings Stack
function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} options={defaultHeader} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ ...defaultHeader, headerTitle: "My Profile" }} />
      <Stack.Screen name="MyServices" component={MyServicesScreen} options={{ ...defaultHeader, headerTitle: "My Services" }} />
      <Stack.Screen name="EditService" component={EditServiceScreen} options={{ ...defaultHeader, headerTitle: "Edit Service" }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ ...defaultHeader, headerTitle: "About" }} />
      <Stack.Screen name="Help" component={HelpScreen} options={{ ...defaultHeader, headerTitle: "Help & Support" }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ ...defaultHeader, headerTitle: "Privacy Policy" }} />
      <Stack.Screen name="Notifications" component={NotificationScreen} options={{ ...defaultHeader, headerTitle: "Notifications" }} />
    </Stack.Navigator>
  );
}

// Services Stack
function ServicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AllServices" component={AllServicesScreen} options={{ ...defaultHeader, headerTitle: "All Services" }} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailScreen} options={{ ...defaultHeader, headerTitle: "Service Details" }} />
      <Stack.Screen name="AddService" component={AddServiceScreen} options={{ ...defaultHeader, headerTitle: "Add New Service" }} />
      <Stack.Screen name="EditService" component={EditServiceScreen} options={{ ...altHeader, headerTitle: "Edit Service" }} />
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
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Schedule':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Services':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Wishlist':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse';
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
    if (user) initializeSocket(user.id);
    return () => disconnectSocket();
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={MainTabs} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ ...defaultHeader, headerTitle: "Payment" }} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ ...defaultHeader, headerTitle: "Payment Success" }} />
        <Stack.Screen name="PaymentFailure" component={PaymentFailureScreen} options={{ ...defaultHeader, headerTitle: "Payment Failed" }} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ ...defaultHeader, headerTitle: "Event Details" }} />
        <Stack.Screen name="FullScreenMap" component={FullScreenMap} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="AllEvents" component={AllEventsScreen} options={{ ...defaultHeader, headerTitle: "All Events" }} />
        <Stack.Screen name="JoinEvent" component={JoinEventWrapper} options={{ ...defaultHeader, headerTitle: "Join Event" }} />
        <Stack.Screen name="Review" component={ReviewScreen} options={{ ...defaultHeader, headerTitle: "Write a Review" }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ ...defaultHeader, headerTitle: "Edit Profile" }} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
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
                  onError={e => console.log('Image loading error:', e.nativeEvent.error)}
                />
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                  {route.params?.recipientName || 'Chat'}
                </Text>
              </View>
            ),
            headerStyle: { backgroundColor: '#5D5FEE', height: 80 },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 22 }
          })}
        />
        <Stack.Screen name="AllServices" component={AllServicesScreen} options={{ ...altHeader, headerTitle: "All Services" }} />
        <Stack.Screen name="AddService" component={AddServiceScreen} options={{ ...altHeader, headerTitle: "Add Service" }} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ ...altHeader, headerTitle: "Service Details" }} />
        <Stack.Screen name="EditService" component={EditServiceScreen} options={{ ...altHeader, headerTitle: "Edit Service" }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} options={{ ...altHeader, headerTitle: "Notifications" }} />
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
