import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as Location from 'expo-location';
import HomeHeader from '../components/home/HomeHeader';
import HomeTabs from '../components/home/HomeTabs';
import CreateEventModal from '../components/home/CreateEventModal';
import LocationPickerModal from '../components/home/LocationPickerModal';
import PopularEvents from '../components/home/PopularEvents';
import NearbyEvents from '../components/home/NearbyEvents';
import CreateEventButton from '../components/home/CreateEventButton';
import { popularEvents, allEvents } from '../constants/mockData';
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
        onNotificationPress={() => navigation.navigate('Notification')}
        onAgentPress={() => navigation.navigate('Agent List')}
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

      <CreateEventButton onPress={() => setCreateEventModalVisible(true)} />

      <HomeTabs activeTab={activeTab} onTabPress={setActiveTab} />

      <TouchableOpacity 
        style={styles.servicesButton}
        onPress={() => navigation.navigate('AddService')}
      >
        <Text style={styles.servicesButtonText}>Add New Service</Text>
      </TouchableOpacity>

      <NearbyEvents navigation={navigation} />
      
      <PopularEvents 
        navigation={navigation} 
        events={popularEvents}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16),
    backgroundColor: '#f9f9f9'
  },
  servicesButton: {
    backgroundColor: '#5D5FEE',
    padding: normalize(12),
    borderRadius: normalize(8),
    marginHorizontal: normalize(16),
    marginVertical: normalize(8),
    alignItems: 'center',
  },
  servicesButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});