import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import EventCard from '../components/EventCard';
import { getAuth, signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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
  }, []);

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setModalVisible(false);
    setLoading(false);
    setErrorMsg(null);
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

      {/* Create Event Button */}
      <TouchableOpacity style={styles.createEventButton}>
        <Ionicons name="add" size={16} color="#fff" />
        <Text style={styles.createEventText}>Create Event</Text>
      </TouchableOpacity>

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

      {/* Popular Events See All */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Popular Events')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.allEvents}>
        {allEvents.map((event, index) => (
          <EventCard
            key={index}
            image={event.image}
            title={event.title}
            location={event.location}
            price={event.price}
            rating={event.rating}
            per={event.per}
            horizontal
            onPress={() => navigation.navigate('EventDetail', { event })}
          />
        ))}
      </View>
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
  titleContainer: {
    marginTop: normalize(16),
    marginBottom: normalize(14),
  },
  title: {
    fontSize: normalize(21),
    fontWeight: 'bold',
    color: '#222',
    marginBottom: normalize(4),
  },
  subtitle: {
    fontSize: normalize(16),
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallText: {
    fontSize: normalize(12),
    color: 'gray',
  },
  locationText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginLeft: normalize(4),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    backgroundColor: '#fff',
    padding: normalize(8),
    borderRadius: normalize(12),
    marginLeft: normalize(8),
  },
  createEventButton: {
    marginTop: normalize(16),
    flexDirection: 'row',
    backgroundColor: '#5D5FEE',
    padding: normalize(12),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  createEventText: {
    color: '#fff',
    marginLeft: normalize(8),
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
  tabs: {
    flexDirection: 'row',
    marginTop: normalize(20),
    marginBottom: normalize(10),
  },
  tab: {
    flex: 1,
    paddingVertical: normalize(12),
    backgroundColor: '#eee',
    marginHorizontal: normalize(5),
    borderRadius: normalize(10),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#5D5FEE',
  },
  tabText: {
    marginTop: normalize(4),
    color: '#000',
    fontSize: normalize(14),
  },
  tabTextActive: {
    marginTop: normalize(4),
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(20),
    marginBottom: normalize(10),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#5D5FEE',
    fontSize: normalize(14),
  },
  popularEvents: {
    flexDirection: 'row',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
  allEvents: {
    flexDirection: 'row',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
});
