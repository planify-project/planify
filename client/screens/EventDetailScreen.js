import React, { useState , useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { AuthContext } from '../context/AuthContext'; 

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function EventDetailScreen({ route }) {
  const { user } = useContext(AuthContext); // Access the user context
  console.log('User:', user); 
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  
  // Get the event data from the route params
  const event = route.params?.event || {
    title: 'Event Title',
    price: '0 DT',
    location: 'Location',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    rating: '0.0',
    per: 'person'
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: normalize(100) }}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.mainImage} />
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
            Experience an unforgettable {event.title.toLowerCase()} at {event.location}. 
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

      {/* Join Event Button */}
      <TouchableOpacity 
        style={styles.joinBtn}
        onPress={() => navigation.navigate('JoinEvent', { event })}
      >
        <Text style={styles.joinBtnText}>Join Event</Text>
      </TouchableOpacity>
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
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    color: '#5D5FEE',
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
    fontSize: normalize(15),
    color: '#555',
    lineHeight: normalize(22),
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
    backgroundColor: '#5D5FEE',
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
