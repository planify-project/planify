// screens/PopularEventsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { API_BASE } from '../config';
import EventCard from '../components/EventCard';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function PopularEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching popular events from:', `${API_BASE}/events/popular`);
      const response = await axios.get(`${API_BASE}/events/popular`);
      
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
        attendees_count: event.attendees_count,
        latitude: event.latitude,
        longitude: event.longitude,
      }));

      console.log('Formatted popular events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching popular events:', err);
      setError('Unable to load popular events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularEvents();
  }, []);

  const renderEventCard = ({ item }) => (
    <EventCard
      {...item}
      onPress={() => navigation.navigate('EventDetail', { event: item })}
    />
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchPopularEvents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Popular Events</Text>
      </View>

      {events.length === 0 ? (
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.noEventsText}>No popular events found</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    padding: normalize(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: normalize(16),
  },
  title: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: normalize(16),
  },
  errorText: {
    color: 'red',
    fontSize: normalize(16),
    textAlign: 'center',
    marginBottom: normalize(16),
  },
  retryButton: {
    backgroundColor: '#4f78f1',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  noEventsText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
  },
});
