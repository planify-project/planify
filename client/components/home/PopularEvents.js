import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import EventCard from '../EventCard';
import { styles } from './styles';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

const API_BASE_URL = 'http://192.168.70.126:3000/api';

const PopularEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching popular events from:', `${API_BASE_URL}/events/popular`);
      const response = await axios.get(`${API_BASE_URL}/events/popular`);
      
      const formattedEvents = response.data.map(event => ({
        id: event.id || event._id,
        title: event.name,
        location: event.location || 'Location not specified',
        price: event.is_free ? 'Free' : `${event.ticketPrice} DT`,
        rating: '4.5',
        per: 'person',
        image: event.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
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

  if (loading) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <View style={{ height: normalize(250), justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#5D5FEE" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <View style={{ height: normalize(250), justifyContent: 'center' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
          <TouchableOpacity onPress={fetchPopularEvents}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
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

export default PopularEvents;