// import React, { useState, useEffect } from 'react';
// import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
// import EventCard from '../components/EventCard';
// import { useWishlist } from '../context/WishlistContext';
// import api from '../configs/api';
// import { getImageUrl } from '../configs/url';

// const { width } = Dimensions.get('window');
// const scale = width / 375;
// function normalize(size) {
//   return Math.round(scale * size);
// }

// export default function WishlistScreen({ navigation }) {
//   const { wishlistItems, loading: wishlistLoading, error: wishlistError, refreshWishlist } = useWishlist();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch events that are in the wishlist
//   useEffect(() => {
//     const fetchWishlistEvents = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log('Current wishlist items:', wishlistItems);

//         // Get all event IDs from wishlist items
//         const eventIds = wishlistItems
//           .filter(item => item.item_type === 'event')
//           .map(item => item.item_id);

//         console.log('Filtered event IDs:', eventIds);

//         if (eventIds.length === 0) {
//           setEvents([]);
//           setLoading(false);
//           return;
//         }

//         // Fetch events data for each ID
//         const eventsPromises = eventIds.map(async (eventId) => {
//           try {
//             console.log('Fetching event with ID:', eventId);
//             const response = await api.get(`/events/${eventId}`);
//             console.log('Event response:', response.data);
            
//             // The event data is directly in response.data, not in response.data.data
//             const event = response.data;
//             return {
//               id: event.id,
//               name: event.name,
//               title: event.name,
//               location: event.location || 'Location not specified',
//               price: event.is_free ? 'Free' : `${event.ticketPrice} DT`,
//               rating: '4.5',
//               per: 'person',
//               image: getImageUrl(event.coverImage) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
//               description: event.description,
//               startDate: event.startDate,
//               endDate: event.endDate,
//               type: event.type,
//               status: event.status,
//               maxParticipants: event.maxParticipants,
//               available_spots: event.available_spots,
//               budget: event.budget
//             };
//           } catch (error) {
//             console.error(`Error fetching event ${eventId}:`, error);
//             return null;
//           }
//         });

//         const eventsData = await Promise.all(eventsPromises);
//         console.log('Fetched events data:', eventsData);
        
//         const validEvents = eventsData.filter(event => event !== null);
//         console.log('Valid events:', validEvents);
        
//         setEvents(validEvents);
//       } catch (error) {
//         console.error('Error fetching wishlist events:', error);
//         setError(error.message || 'Failed to fetch wishlist events');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWishlistEvents();
//   }, [wishlistItems]);

//   // Add a refresh effect when the screen comes into focus
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       refreshWishlist();
//     });

//     return unsubscribe;
//   }, [navigation, refreshWishlist]);

//   if (wishlistLoading || loading) {
//     return (
//       <View style={styles.screen}>
//         <ActivityIndicator size="large" color="#8d8ff3" />
//       </View>
//     );
//   }

//   if (wishlistError || error) {
//     return (
//       <View style={styles.screen}>
//         <Text style={styles.errorText}>{wishlistError || error}</Text>
//       </View>
//     );
//   }

//   if (!events || events.length === 0) {
//     return (
//       <View style={styles.screen}>
//         <Text style={styles.emptyText}>Your wishlist is empty</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       <FlatList
//         data={events}
//         keyExtractor={item => item.id.toString()}
//         renderItem={({ item }) => (
//           <EventCard
//             id={item.id}
//             image={item.image}
//             title={item.title}
//             location={item.location}
//             price={item.price}
//             rating={item.rating}
//             per={item.per}
//             horizontal={true}
//             onPress={() => navigation.navigate('EventDetail', { event: item })}
//           />
//         )}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         refreshing={loading}
//         onRefresh={refreshWishlist}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#F4F6FC',
//     padding: normalize(16),
//   },
//   listContent: {
//     paddingBottom: normalize(20),
//   },
//   errorText: {
//     color: 'red',
//     fontSize: normalize(16),
//     textAlign: 'center',
//   },
//   emptyText: {
//     fontSize: normalize(16),
//     color: '#666',
//     textAlign: 'center',
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ActivityIndicator, Text, Image } from 'react-native';
import EventCard from '../components/EventCard';
import { useWishlist } from '../context/WishlistContext';
import api from '../configs/api';
import { getImageUrl } from '../configs/url';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C6FD1" />
        <Text style={styles.loadingText}>Loading your wishlist...</Text>
      </View>
    );
  }

  if (wishlistError || error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={normalize(60)} color="#FF3B5E" />
        <Text style={styles.errorText}>{wishlistError || error}</Text>
      </View>
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1560420025-9453f02b4751?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
          style={styles.emptyImage} 
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
        <Text style={styles.emptySubtitle}>Save your favorite events to find them here</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.headerSubtitle}>{events.length} saved events</Text>
      </View>
      
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
    backgroundColor: '#F8F9FF',
    padding: normalize(16),
  },
  header: {
    marginBottom: normalize(20),
    paddingHorizontal: normalize(4),
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(6),
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: '#6E6E87',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: normalize(30),
    gap: normalize(16),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  loadingText: {
    marginTop: normalize(16),
    fontSize: normalize(16),
    color: '#6E6E87',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  errorText: {
    color: '#FF3B5E',
    fontSize: normalize(16),
    textAlign: 'center',
    marginTop: normalize(16),
    fontWeight: '500',
    maxWidth: '80%',
    lineHeight: normalize(22),
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  emptyImage: {
    width: normalize(200),
    height: normalize(200),
    marginBottom: normalize(24),
    opacity: 0.8,
    borderRadius: normalize(16),
  },
  emptyTitle: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(8),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: normalize(16),
    color: '#6E6E87',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: normalize(22),
  },
  cardShadow: {
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    overflow: 'hidden',
    marginBottom: normalize(16),
  },
  cardImage: {
    width: '100%',
    height: normalize(180),
  },
  cardContent: {
    padding: normalize(16),
  },
  cardTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(8),
  },
  cardLocation: {
    fontSize: normalize(14),
    color: '#6E6E87',
    marginBottom: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#6C6FD1',
  },
  cardPriceUnit: {
    fontSize: normalize(14),
    color: '#6E6E87',
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRatingText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#2A2A3C',
    marginLeft: normalize(4),
  },
  locationIcon: {
    marginRight: normalize(4),
    color: '#6C6FD1',
  },
  starIcon: {
    color: '#FFD700',
  },
  refreshIndicator: {
    color: '#6C6FD1',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    marginVertical: normalize(12),
  },
});