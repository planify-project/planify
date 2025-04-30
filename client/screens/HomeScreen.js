import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Modal, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import EventCard from '../components/EventCard';
import { getAuth, signOut } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import api from '../configs/api';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState(null);

  const popularEvents = [
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Pool party",
      location: "Les grottes, Bizerte",
      price: "20 DT",
      rating: "5.0",
      per: "person"
    },
    {
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02c5",
      title: "Golden Palace",
      location: "Cite Hasan, Nabeul",
      price: "175 DT",
      rating: "4.5",
      per: "night"
    }
  ];

  const allEvents = [
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      title: "Beach outing",
      location: "Coco beach Ghar El Milh, Bizerte",
      price: "80 DT",
      rating: "5.0",
      per: "person"
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Pool party",
      location: "Les grottes, Bizerte",
      price: "20 DT",
      rating: "5.0",
      per: "person"
    }
  ];

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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      setError(null);
      const response = await api.get('/services');
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('Server is not running. Please start the server.');
      } else if (error.code === 'ETIMEDOUT') {
        setError('Request timed out. Please check your internet connection.');
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setModalVisible(false);
    setLoading(false);
    setErrorMsg(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    // Here you would typically save the selected date to your backend
    // For example:
    // axios.post('http://localhost:3000/api/schedule', {
    //   eventName,
    //   date: date.dateString,
    //   userId: getAuth().currentUser.uid
    // });
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
      {/* Location and Notification */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallText}>Current location</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={16} color="#000" />
            {loading ? (
              <ActivityIndicator size="small" style={{ marginLeft: 4 }} />
            ) : (
              <Text style={styles.locationText}>{city || errorMsg || 'Detecting...'}</Text>
            )}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 8 }}>
              <Ionicons name="pencil-outline" size={16} color="#5D5FEE" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => {
              navigation.navigate('Agent List')
            }}
          >
            <Ionicons name="person-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: 300 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Select your city</Text>
            {['Bizerte', 'Tunis', 'Nabeul', 'Sousse', 'Sfax'].map((cityOption) => (
              <Pressable key={cityOption} onPress={() => handleSelectCity(cityOption)} style={{ padding: 12 }}>
                <Text style={{ fontSize: 16 }}>{cityOption}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => { setModalVisible(false); getLocation(); }} style={{ marginTop: 16 }}>
              <Text style={{ color: '#5D5FEE', textAlign: 'center' }}>Use my current location</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Create Event Button - Fix the structure */}
      <TouchableOpacity 
        style={styles.createEventButton}
        onPress={() => setCreateEventModalVisible(true)}
      >
        <Ionicons name="add" size={16} color="#fff" />
        <Text style={styles.createEventText}>Create Event</Text>
      </TouchableOpacity>

      {/* Create Event Modal */}
      <Modal
        visible={createEventModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateEventModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: 300 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Create New Event</Text>
            
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>NAME</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16
              }}
              placeholder="Event name"
              value={eventName}
              onChangeText={setEventName}
            />
            
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>SELECT DATE</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#5D5FEE' }
              }}
              theme={{
                selectedDayBackgroundColor: '#5D5FEE',
                todayTextColor: '#5D5FEE',
                arrowColor: '#5D5FEE',
              }}
              style={{
                borderRadius: 8,
                marginBottom: 16
              }}
            />
            
            <TouchableOpacity
              style={{
                backgroundColor: '#5D5FEE',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 12
              }}
              onPress={() => {
                if (eventName && selectedDate) {
                  setCreateEventModalVisible(false);
                  setEventName('');
                  setSelectedDate('');
                  navigation.navigate('CreateEvent', { eventName, date: selectedDate });
                }
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Create</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
                setCreateEventModalVisible(false);
                setEventName('');
                setSelectedDate('');
              }}
            >
              <Text style={{ color: '#666', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab]}>
          <Ionicons name="calendar-outline" size={20} color="#000" />
          <Text style={styles.tabText}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="home-outline" size={20} color="#000" />
          <Text style={styles.tabText}>Event space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="construct-outline" size={20} color="#000" />
          <Text style={styles.tabText}>Services</Text>
        </TouchableOpacity>
      </View>

      {/* Near Location See All */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Near Location</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllEvents')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: normalize(250) }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <EventCard
            image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            title="Pool party"
            location="Les grottes, Bizerte"
            price="20 DT"
            rating="5.0"
            per="person"
            onPress={() => navigation.navigate('EventDetail', { event: {
              image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
              title: "Pool party",
              location: "Les grottes, Bizerte",
              price: "20 DT",
              rating: "5.0",
              per: "person"
            }})}
          />
          <EventCard
            image="https://images.unsplash.com/photo-1560185127-6ed189bf02c5"
            title="Golden Palace"
            location="Cite Hasan, Nabeul"
            price="175 DT"
            rating="4.5"
            per="night"
            onPress={() => navigation.navigate('EventDetail', { event: {
              image: "https://images.unsplash.com/photo-1560185127-6ed189bf02c5",
              title: "Golden Palace",
              location: "Cite Hasan, Nabeul",
              price: "175 DT",
              rating: "4.5",
              per: "night"
            }})}
          />
        </ScrollView>
      </View>

      {/* Services List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Popular Events')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {loadingServices ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D5FEE" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchServices}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.allEvents}>
          {services.map((service) => (
            <EventCard
              key={service.id}
              image={service.image}
              title={service.name}
              location={service.location}
              price={`${service.price} ${service.currency}`}
              rating={service.rating.toString()}
              per={service.per}
              horizontal
              onPress={() => navigation.navigate('EventDetail', { event: service })}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const scale = width / 375;

function normalize(size) {
  return Math.round(scale * size);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16),
    backgroundColor: '#f9f9f9'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20)
  },
  smallText: {
    fontSize: normalize(12),
    color: '#555'
  },
  locationText: {
    marginLeft: 4,
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#000'
  },
  notificationBtn: {
    padding: normalize(8),
    backgroundColor: '#eee',
    borderRadius: normalize(8),
    marginLeft: normalize(10)
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D5FEE',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(8),
    alignSelf: 'center',
    marginBottom: normalize(20),
    gap: 6
  },
  createEventText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(14)
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: normalize(20)
  },
  tab: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(20),
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  activeTab: {
    backgroundColor: '#5D5FEE',
  },
  tabText: {
    fontSize: normalize(14),
    color: '#000'
  },
  tabTextActive: {
    fontSize: normalize(14),
    color: '#fff'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(16),
    marginBottom: normalize(8)
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#000'
  },
  seeAllText: {
    fontSize: normalize(14),
    color: '#5D5FEE'
  },
  allEvents: {
    marginTop: normalize(10),
    gap: normalize(10)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: '#ff4444',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: 10
  },
  retryButton: {
    backgroundColor: '#5D5FEE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
