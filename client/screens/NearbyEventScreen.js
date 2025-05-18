import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import EventCard from '../components/EventCard';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';

// Responsive scaling
const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function AllEventsScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events from:', `${API_BASE}/events/public`);
      const response = await axios.get(`${API_BASE}/events/public`);
      console.log('Response received:', response.data);
      
      const formattedEvents = response.data.map(event => ({
        id: event.id,
        title: event.name,
        location: event.location || 'Location not specified',
        price: event.is_free ? 'Free' : `${event.ticketPrice} DT`,
        rating: '4.5', // You might want to add a rating system later
        per: 'person',
        image: event.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        type: event.type,
        status: event.status,
        maxParticipants: event.maxParticipants,
        available_spots: event.available_spots,
        budget: event.budget
      }));
      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetail', { event });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4f78f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explore Events</Text>
      </View>

      {/* Events List */}
      <ScrollView style={styles.eventsContainer}>
        {events.map((event, index) => (
          <EventCard
            key={event.id || index}
            id={event.id}
            image={event.image}
            title={event.title}
            location={event.location}
            price={event.price}
            rating={event.rating}
            per={event.per}
            onPress={() => navigation.navigate('EventDetail', { event })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    backgroundColor: '#F6F7FB',
  },
  headerBtn: {
    padding: normalize(8),
    width: normalize(40),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#222',
  },
  titleContainer: {
    padding: normalize(16),
    backgroundColor: '#F6F7FB',
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#222',
    marginBottom: normalize(4),
  },
  subtitle: {
    fontSize: normalize(16),
    color: '#666',
  },
  eventsContainer: {
    flex: 1,
    padding: normalize(16),
  },
  eventCardContainer: {
    marginBottom: normalize(16),
  },
  errorText: {
    color: 'red',
    fontSize: normalize(16),
    textAlign: 'center',
    padding: normalize(16),
  },
});