import React, { useState , useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { AuthContext } from '../context/AuthContext'; 

import { useWishlist } from '../context/WishlistContext';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function EventDetailScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  
  // Get the event data from the route params
  const event = route.params?.event || {
    title: 'Event Title',
    price: '0 DT',
    location: 'Location',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    rating: '0.0',
    per: 'person'
  };

  const isWishlisted = isInWishlist(event.id);

  const handleWishlistPress = () => {
    if (event.id) {
      toggleWishlistItem(event.id, 'event');
    }
  };

  // Generate additional images for preview
  const images = [
    event.image,
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  ];

  // Example coordinates for demonstration (replace with real event coordinates)
  const eventCoords = {
    latitude: 37.2746, // Replace with actual latitude
    longitude: 9.8642, // Replace with actual longitude
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.mainImage} />
          <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={handleWishlistPress}
          >
            <Ionicons 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={normalize(24)} 
              color={isWishlisted ? "red" : "white"} 
            />
          </TouchableOpacity>
        </View>

        {/* Event Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={normalize(16)} color="#5D5FEE" />
            <Text style={styles.locationText}>{event.location}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{event.price}</Text>
            <Text style={styles.perText}>/{event.per}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={normalize(16)} color="#FFD700" />
            <Text style={styles.ratingText}>{event.rating}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>
            Experience an unforgettable {event.title ? event.title.toLowerCase() : 'event'} at {event.location || 'our venue'}. 
            This event promises to deliver an amazing experience with top-notch facilities and services.
            Don't miss out on this opportunity to create lasting memories!
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Event Location</Text>
          <MapView
            style={styles.map}
            initialRegion={eventCoords}
          >
            <Marker coordinate={eventCoords} title={event.title} description={event.location} />
          </MapView>
        </View>

        {/* Preview Images */}
        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.previewImage} />
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#5D5FEE' }]}
          onPress={() => navigation.navigate('JoinEvent', { event })}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Join Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#5D5FEE' }]}
          onPress={() => {
            // Extract numeric value from event.price (e.g., '20 DT' -> 20)
            const price = parseFloat(String(event.price).replace(/[^\d.]/g, ''));
            navigation.navigate('Payment', { 
              amount: price,
              eventId: event.id 
            });
          }}
        >
          <Ionicons name="card-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Pay & Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: "auto",
    flex: 1,

    backgroundColor: '#F6F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBtn: {
    padding: normalize(8),
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#222',
  },
  imageContainer: {
    width: '100%',
    height: normalize(250),
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  wishlistButton: {
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: normalize(8),
    borderRadius: normalize(20),
  },
  infoContainer: {
    padding: normalize(16),
    backgroundColor: '#fff',
  },
  eventTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#222',
    marginBottom: normalize(8),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  locationText: {
    fontSize: normalize(16),
    color: '#666',
    marginLeft: normalize(4),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: normalize(8),
  },
  price: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#5D5FEE',
  },
  perText: {
    fontSize: normalize(14),
    color: '#666',
    marginLeft: normalize(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: normalize(16),
    color: '#222',
    marginLeft: normalize(4),
  },
  descriptionContainer: {
    padding: normalize(16),
    backgroundColor: '#fff',
    marginTop: normalize(8),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#222',
    marginBottom: normalize(12),
  },
  description: {
    fontSize: normalize(16),
    color: '#666',
    lineHeight: normalize(24),
  },
  previewContainer: {
    padding: normalize(16),
    backgroundColor: '#fff',
    marginTop: normalize(8),
  },
  previewImage: {
    width: normalize(120),
    height: normalize(80),
    borderRadius: normalize(8),
    marginRight: normalize(8),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: normalize(16),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: normalize(8),
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
  mapContainer: {
    padding: normalize(16),
    backgroundColor: '#fff',
    marginTop: normalize(8),
    borderRadius: normalize(8),
  },
  map: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(8),
    marginTop: normalize(8),
  },
});