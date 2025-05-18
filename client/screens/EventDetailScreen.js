import React, { useState , useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Dimensions, Alert } from 'react-native';
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

export default function EventDetailScreen({ route }) {
  const { event } = route.params;

  const { user } = useContext(AuthContext); // Access the user context
  console.log('User:', user); 
  const [isFavorite, setIsFavorite] = useState(false);
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const navigation = useNavigation();
  console.log("🛖🛖🛖");
  console.log("🛖🛖🛖",event);    
  
  // Get the event data from the route params

  const isWishlisted = isInWishlist(event.id);

  const handleWishlistPress = () => {
    if (event.id) {
      toggleWishlistItem(event.id, 'event');
    }
  };

  // Generate additional images for preview
  const images = [
    event.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  ];

  // Use actual event coordinates if available, otherwise use default
  const eventCoords = {
    latitude: event.latitude || 37.2746,
    longitude: event.longitude || 9.8642,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: normalize(100) }}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: event.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' }} 
            style={styles.mainImage}
            onError={(e) => {
              console.error('Image loading error:', e.nativeEvent.error);
            }}
          />
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
          <Text style={styles.eventTitle}>{event.name}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={normalize(16)} color="#4f78f1" />
            <Text style={styles.locationText}>{event.location}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {event.is_free ? 'Free' : `${event.ticketPrice || 'N/A'} DT`}
            </Text>
            <Text style={styles.perText}>/person</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={normalize(16)} color="#FFD700" />
            <Text style={styles.ratingText}>N/A</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About this event</Text>
          <Text style={styles.description}>
            {event.description || `Experience an unforgettable ${event.name ? event.name.toLowerCase() : 'event'} at ${event.location || 'our venue'}. 
            This event promises to deliver an amazing experience with top-notch facilities and services.
            Don't miss out on this opportunity to create lasting memories!`}
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Event Location</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('FullScreenMap', {
              latitude: event.latitude || 37.2746,
              longitude: event.longitude || 9.8642,
              title: event.name,
              location: event.location,
            })}
          >
            <MapView
              style={styles.map}
              initialRegion={eventCoords}
            >
              <Marker 
                coordinate={eventCoords} 
                title={event.name} 
                description={event.location} 
              />
            </MapView>
          </TouchableOpacity>
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
              <Image 
                source={{ uri: item }} 
                style={styles.previewImage}
                onError={(e) => {
                  console.error('Preview image loading error:', e.nativeEvent.error);
                }}
              />
            )}
          />
        </View>
      </ScrollView>



            {/* Join Event Button */}
      {/* <TouchableOpacity 
        style={styles.joinBtn}
        onPress={() => navigation.navigate('JoinEvent', { event })}
      >
        <Text style={styles.joinBtnText}>Join Event</Text>
      </TouchableOpacity> */}
      {/* Write Review Button */}
<TouchableOpacity 
  style={[styles.joinBtn, { backgroundColor: '#fff', top: normalize(20), bottom: undefined, borderWidth: 1, borderColor: '#4f78f1' }]}
  onPress={() => {
    console.log("😍😍😍😍😍",event);
    navigation.navigate('Review', { event })}}
>
  <Text style={[styles.joinBtnText, { color: '#4f78f1' }]}>Write a Review</Text>
</TouchableOpacity>





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
          onPress={() => navigation.navigate('Payment')}
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
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  imageContainer: {
    width: '100%',
    height: normalize(260),
    overflow: 'hidden',
    borderBottomLeftRadius: normalize(24),
    borderBottomRightRadius: normalize(24),
    backgroundColor: '#ccc',

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
    padding: normalize(20),
    backgroundColor: '#fff',
    marginHorizontal: normalize(16),
    marginTop: -normalize(30),
    borderRadius: normalize(16),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 3,
  },
  eventTitle: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#1F1F39',
    marginBottom: normalize(10),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  locationText: {
    fontSize: normalize(15),
    color: '#777',
    marginLeft: normalize(6),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: normalize(6),
  },
  price: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#4f78f1',
  },
  perText: {
    fontSize: normalize(14),
    color: '#888',
    marginLeft: normalize(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: normalize(14),
    color: '#444',
    marginLeft: normalize(4),
  },
  descriptionContainer: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#1F1F39',
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
    marginTop: normalize(20),
    paddingHorizontal: normalize(20),
  },
  map: {
    width: '100%',
    height: normalize(180),
    borderRadius: normalize(12),
    marginTop: normalize(8),
  },
  previewContainer: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(20),
  },
  previewImage: {
    width: normalize(110),
    height: normalize(80),
    borderRadius: normalize(10),
    marginRight: normalize(10),
  },
  joinBtn: {
    backgroundColor: '#4f78f1',
    paddingVertical: normalize(16),
    borderRadius: normalize(30),
    position: 'absolute',
    bottom: normalize(20),
    left: normalize(20),
    right: normalize(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: normalize(17),
    fontWeight: '600',
  },
});
