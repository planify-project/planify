import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, Alert, View, Image, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { AuthContext } from '../context/AuthContext';
import HomeHeader from '../components/home/HomeHeader';
import HomeTabs from '../components/home/HomeTabs';
import CreateEventModal from '../components/home/CreateEventModal';
import LocationPickerModal from '../components/home/LocationPickerModal';
import PopularEvents from '../components/home/PopularEvents';
import NearbyEvents from '../components/home/NearbyEvents';
import CreateEventButton from '../components/home/CreateEventButton';
import { normalize } from '../utils/scaling';
import axios from 'axios';
import { API_BASE } from '../config'; // Make sure this points to your backend
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';


export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('event'); // Set default to 'event'
  const [publicEvents, setPublicEvents] = useState([]);
  const { user } = useContext(AuthContext);

  // Reset active tab when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setActiveTab(-1);
    }, [])
  );

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

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  const fetchPublicEvents = async () => {
    try {
      console.log('Fetching public events...');
      const response = await axios.get(`${API_BASE}/events/public`);
      setPublicEvents(response.data);
    } catch (err) {
      console.error('Error fetching public events:', err);
      // handle error
    } finally {
      setLoading(false);
    }
  };

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

  const handleTabPress = (index) => {
    setActiveTab(index);
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <HomeHeader
        loading={loading}
        city={city}
        errorMsg={errorMsg}
        onLocationPress={() => setModalVisible(true)}
        onNotificationPress={() => navigation.navigate('Notifications')}
        onAgentPress={() => navigation.navigate('AgentList')}
        onMessagePress={() => navigation.navigate('Messages')}
      />

      <LocationPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectCity={handleSelectCity}
        onUseCurrentLocation={getLocation}
      />

      <CreateEventModal
        visible={createEventModalVisible}
        eventName={eventName}
        selectedDate={selectedDate}
        onClose={() => {
          setCreateEventModalVisible(false);
          setEventName('');
          setSelectedDate('');
        }}
        onEventNameChange={setEventName}
        onDateSelect={handleDateSelect}
        onCreateEvent={handleCreateEvent}
      />

      <CreateEventButton
        onPress={handleCreateEventPress}
      />

      <HomeTabs
        activeTab={activeTab}
        onTabPress={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'events') {
            navigation.navigate('AllEvents');
          } else if (tabId === 'services') {
            navigation.navigate('AllServices');
          }
        }}
        navigation={navigation}
      />

      <NearbyEvents events={publicEvents} navigation={navigation} loading={loading} />

      <PopularEvents events={publicEvents} navigation={navigation} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16),
    backgroundColor: '#f9f9f9'
  },
  allEventsButton: {
    backgroundColor: '#4f78f1',
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginVertical: normalize(16),
  },
  allEventsButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});