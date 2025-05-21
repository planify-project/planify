import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../utils/scaling';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';
import EventSpaceBookingModal from '../components/EventSpaceBookingModal';

const { width } = Dimensions.get('window');

export default function EventSpaceDetails({ route, navigation }) {
  const { space } = route.params;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleBooking = async (bookingData) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to book a space');
      return;
    }

    try {
      setLoading(true);

      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      if (!userResponse.data.success) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;

      const bookingPayload = {
        userId: dbUserId,
        eventSpaceId: space.id,
        startDate: bookingData.startDate.toISOString(),
        endDate: bookingData.endDate.toISOString(),
        phoneNumber: bookingData.phoneNumber,
        status: 'pending'
      };

      const response = await api.post('/event-spaces/bookings', bookingPayload);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your booking request has been sent successfully!',
          [{ text: 'OK', onPress: () => setShowBookingModal(false) }]
        );
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: space.images?.[0] || 'https://via.placeholder.com/400x300' }} 
          style={styles.mainImage} 
        />
      </View>

      {/* Space Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.spaceTitle}>{space.name}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={normalize(16)} color="#5D5FEE" />
          <Text style={styles.locationText}>{space.location}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{space.price} DT</Text>
          <Text style={styles.perText}>/day</Text>
        </View>

        <Text style={styles.description}>{space.description}</Text>

        {/* Amenities */}
        <View style={styles.amenitiesContainer}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesList}>
            {space.amenities && Object.entries(space.amenities).map(([key, value]) => (
              value && (
                <View key={key} style={styles.amenityItem}>
                  <Ionicons 
                    name={getAmenityIcon(key)} 
                    size={normalize(20)} 
                    color="#5D5FEE" 
                  />
                  <Text style={styles.amenityText}>{formatAmenityName(key)}</Text>
                </View>
              )
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.availabilityContainer}>
          <Text style={styles.sectionTitle}>Availability</Text>
          {space.availability && Object.entries(space.availability).map(([day, hours]) => (
            <View key={day} style={styles.availabilityRow}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.hoursText}>{hours}</Text>
            </View>
          ))}
        </View>

        {/* Gallery */}
        <View style={styles.galleryContainer}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {space.images?.map((image, index) => (
              <Image 
                key={index}
                source={{ uri: image }} 
                style={styles.galleryImage} 
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Book Button */}
      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() => setShowBookingModal(true)}
      >
        <Text style={styles.bookButtonText}>Book This Space</Text>
      </TouchableOpacity>

      <EventSpaceBookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBooking}
        loading={loading}
        space={space}
      />
    </ScrollView>
  );
}

// Helper functions
function getAmenityIcon(amenity) {
  const icons = {
    pool: 'water-outline',
    wifi: 'wifi-outline',
    parking: 'car-outline',
    catering: 'restaurant-outline',
    beach_access: 'beach-outline',
  };
  return icons[amenity] || 'checkmark-circle-outline';
}

function formatAmenityName(amenity) {
  return amenity.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  imageContainer: {
    width: '100%',
    height: normalize(250),
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: normalize(16),
    backgroundColor: '#fff',
  },
  spaceTitle: {
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
    marginBottom: normalize(16),
  },
  price: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#5D5FEE',
  },
  perText: {
    fontSize: normalize(14),
    color: '#666',
    marginLeft: normalize(4),
  },
  description: {
    fontSize: normalize(16),
    color: '#666',
    lineHeight: normalize(24),
    marginBottom: normalize(24),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#222',
    marginBottom: normalize(16),
  },
  amenitiesContainer: {
    marginBottom: normalize(24),
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(16),
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7FB',
    padding: normalize(8),
    borderRadius: normalize(8),
    minWidth: normalize(100),
  },
  amenityText: {
    marginLeft: normalize(8),
    fontSize: normalize(14),
    color: '#666',
  },
  availabilityContainer: {
    marginBottom: normalize(24),
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    fontSize: normalize(14),
    color: '#222',
    fontWeight: '500',
  },
  hoursText: {
    fontSize: normalize(14),
    color: '#666',
  },
  galleryContainer: {
    marginBottom: normalize(24),
  },
  galleryImage: {
    width: normalize(200),
    height: normalize(150),
    borderRadius: normalize(8),
    marginRight: normalize(8),
  },
  bookButton: {
    backgroundColor: '#5D5FEE',
    margin: normalize(16),
    borderRadius: normalize(12),
    paddingVertical: normalize(16),
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
  },
}); 