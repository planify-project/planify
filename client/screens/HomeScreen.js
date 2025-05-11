import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import HomeHeader from '../components/home/HomeHeader';
import HomeTabs from '../components/home/HomeTabs';
import CreateEventModal from '../components/home/CreateEventModal';
import LocationPickerModal from '../components/home/LocationPickerModal';
import PopularEvents from '../components/home/PopularEvents';
import NearbyEvents from '../components/home/NearbyEvents';
import CreateEventButton from '../components/home/CreateEventButton';
import { popularEvents } from '../constants/mockData';
import { normalize } from '../utils/scaling';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useContext(AuthContext);

  const getLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeout: 10000,
      });

      setLocation(location);

      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        setCity(geocode[0].city || geocode[0].region || geocode[0].country || 'Unknown location');
      } else {
        setCity('Unknown location');
      }
      setErrorMsg(null);
    } catch (error) {
      console.log(error);
      setErrorMsg('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setLoading(false);
    setErrorMsg(null);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleCreateEvent = () => {
    if (eventName && selectedDate) {
      setCreateEventModalVisible(false);
      navigation.navigate('CreateEvent', { 
        eventName: eventName, 
        date: selectedDate 
      });
      // Reset form
      setEventName('');
      setSelectedDate('');
    }
  };

  const handleCreateEventPress = () => {
    if (user) {
      setCreateEventModalVisible(true);
    } else {
      navigation.navigate('Auth');
    }
  };

  let locationText = 'Detecting...';
  if (errorMsg) {
    locationText = errorMsg;
  } else if (city) {
    locationText = city;
  } else if (location) {
    locationText = `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`;
  }

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

      <CreateEventButton 
        onPress={handleCreateEventPress} 
      />

      <HomeTabs
        activeTab={activeTab}
        onTabPress={setActiveTab}
        navigation={navigation}
      />

      <NearbyEvents navigation={navigation} />
      
      <PopularEvents 
        navigation={navigation} 
        events={popularEvents}
      />

      <TouchableOpacity 
        style={styles.allEventsButton} 
        onPress={() => navigation.navigate('AllEvents')}
      >
        <Text style={styles.allEventsButtonText}>Explore All Events</Text>
      </TouchableOpacity>
    </ScrollView>
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
            case 'Wishlist': 
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Settings': 
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5D5FEE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="Root" 
                component={MainTabs} 
              />
              <Stack.Screen 
                name="Auth" 
                component={AuthNavigator} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}