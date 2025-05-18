import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import EventCard from '../EventCard';
import { styles } from './styles';
import { API_BASE } from '../../config';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

// const API_BASE_URL = 'http://192.168.0.89:3000/api';

const PopularEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularEvents();
  }, []);

  const fetchPopularEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE}/events/popular`);
      
      const formattedEvents = response.data.map(event => ({
        id: event.id || event._id,
        title: event.name,
        location: event.location,
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
        budget: event.budget,
        attendees_count: event.attendees_count,
        latitude: event.latitude,
        longitude: event.longitude,
      }));

      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching popular events:', err);
      setError('Failed to load popular events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <View style={{ height: normalize(250), justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5D5FEE" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <View style={{ height: normalize(250), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Popular Events')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: normalize(250) }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
    </>
  );
};

export default PopularEvents;