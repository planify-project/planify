import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import EventCard from '../EventCard';
import { styles } from './styles';
import api from '../../configs/api';
import { normalize } from '../../utils/scaling';

const NearbyEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNearbyEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Fetch nearby events
      const response = await api.get('/events/nearby', {
        params: {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          radius: 50
        }
      });

      const formattedEvents = response.data.map(event => ({
        id: event.id || event._id,
        title: event.name,
        location: event.location || 'Location not specified',
        price: event.is_free ? 'Free' : `${event.ticketPrice} DT`,
        rating: '4.5',
        per: 'person',
        image: event.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        available_spots: event.available_spots,
        budget: event.budget,
        latitude: event.latitude,
        longitude: event.longitude,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching nearby events:', err);
      setError('Unable to load nearby events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Events</Text>
        <View style={{ height: normalize(250), justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5D5FEE" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Events</Text>
        <View style={{ height: normalize(250), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
          <TouchableOpacity onPress={fetchNearbyEvents}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllEvents')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {events.map((event, index) => (
          <EventCard
            key={event.id || index}
            {...event}
            onPress={() => navigation.navigate('EventDetail', { event })}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default NearbyEvents;