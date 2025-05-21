import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import EventCard from '../components/EventCard';
import { useWishlist } from '../context/WishlistContext';
import api from '../configs/api';
import { getImageUrl } from '../configs/url';

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

  // Fetch events that are in the wishlist
  useEffect(() => {
    const fetchWishlistEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Current wishlist items:', wishlistItems);

        // Get all event IDs from wishlist items
        const eventIds = wishlistItems
          .filter(item => item.item_type === 'event')
          .map(item => item.item_id);

        console.log('Filtered event IDs:', eventIds);

        if (eventIds.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        // Fetch events data for each ID
        const eventsPromises = eventIds.map(async (eventId) => {
          try {
            console.log('Fetching event with ID:', eventId);
            const response = await api.get(`/events/${eventId}`);
            console.log('Event response:', response.data);
            
            // The event data is directly in response.data, not in response.data.data
            const event = response.data;
            return {
              id: event.id,
              name: event.name,
              title: event.name,
              location: event.location || 'Location not specified',
              price: event.is_free ? 'Free' : `${event.ticketPrice} DT`,
              rating: '4.5',
              per: 'person',
              image: getImageUrl(event.coverImage) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
              description: event.description,
              startDate: event.startDate,
              endDate: event.endDate,
              type: event.type,
              status: event.status,
              maxParticipants: event.maxParticipants,
              available_spots: event.available_spots,
              budget: event.budget
            };
          } catch (error) {
            console.error(`Error fetching event ${eventId}:`, error);
            return null;
          }
        });

        const eventsData = await Promise.all(eventsPromises);
        console.log('Fetched events data:', eventsData);
        
        const validEvents = eventsData.filter(event => event !== null);
        console.log('Valid events:', validEvents);
        
        setEvents(validEvents);
      } catch (error) {
        console.error('Error fetching wishlist events:', error);
        setError(error.message || 'Failed to fetch wishlist events');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistEvents();
  }, [wishlistItems]);

  // Add a refresh effect when the screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshWishlist();
    });

    return unsubscribe;
  }, [navigation, refreshWishlist]);

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

  if (!events || events.length === 0) {
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