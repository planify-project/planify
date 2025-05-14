import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import EventCard from '../components/EventCard';

// Responsive scaling
const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function AllEventsScreen({ navigation }) {
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#5D5FEE" />
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerTitleButton}>
          <Text style={styles.headerTitleButtonText}>All Events</Text>
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            id={item.id}
            image={item.image}
            title={item.title}
            location={item.location}
            price={item.price}
            rating={item.rating}
            per={item.per}
            horizontal={true}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: normalize(16),
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  headerButton: {
    padding: normalize(8),
  },
  headerTitleButton: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleButtonText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#222',
  },
  listContent: {
    paddingBottom: normalize(20),
  },
  errorText: {
    color: 'red',
    fontSize: normalize(16),
    textAlign: 'center',
  },
});