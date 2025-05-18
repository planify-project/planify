import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import EventCard from '../components/EventCard';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import { API_BASE } from '../config';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function WishlistScreen({ navigation }) {
  const { wishlistItems, loading: wishlistLoading, error: wishlistError, refreshWishlist } = useWishlist();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allEvents, setAllEvents] = useState([]);

  // Fetch all events once when component mounts
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE}/events/public`);
        setAllEvents(response.data);
      } catch (err) {
        console.error('Error fetching all events:', err);
      }
    };
    fetchAllEvents();
  }, []);

  // Update events whenever wishlistItems changes
  useEffect(() => {
    if (!wishlistItems || wishlistItems.length === 0) {
      setEvents([]);
      return;
    }

    // Filter events that are in the wishlist
    const wishlistedEvents = allEvents.filter(event => 
      wishlistItems.some(item => Number(item.item_id) === Number(event.id))
    );

    // Format the events
    const formattedEvents = wishlistedEvents.map(event => ({
      id: event.id,
      name: event.name,
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

    setEvents(formattedEvents);
    setLoading(false);
  }, [wishlistItems, allEvents]);

  if (wishlistLoading || loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#5D5FEE" />
      </View>
    );
  }

  if (wishlistError || error) {
    return (
      <View style={styles.screen}>
        <Text style={styles.errorText}>{wishlistError || error}</Text>
      </View>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
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
        refreshing={loading}
        onRefresh={refreshWishlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FC',
    padding: normalize(16),
  },
  listContent: {
    paddingBottom: normalize(20),
  },
  errorText: {
    color: 'red',
    fontSize: normalize(16),
    textAlign: 'center',
  },
  emptyText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
  },
});