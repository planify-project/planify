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
          <Ionicons name="location-outline" size={normalize(16)} color="#8d8ff3" />
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
                    color="#8d8ff3" 
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F6F7FB',
//   },
//   imageContainer: {
//     width: '100%',
//     height: normalize(250),
//   },
//   mainImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   infoContainer: {
//     padding: normalize(16),
//     backgroundColor: '#fff',
//   },
//   spaceTitle: {
//     fontSize: normalize(24),
//     fontWeight: 'bold',
//     color: '#222',
//     marginBottom: normalize(8),
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(8),
//   },
//   locationText: {
//     fontSize: normalize(16),
//     color: '#666',
//     marginLeft: normalize(4),
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     marginBottom: normalize(16),
//   },
//   price: {
//     fontSize: normalize(24),
//     fontWeight: 'bold',
//     color: '#8d8ff3',
//   },
//   perText: {
//     fontSize: normalize(14),
//     color: '#666',
//     marginLeft: normalize(4),
//   },
//   description: {
//     fontSize: normalize(16),
//     color: '#666',
//     lineHeight: normalize(24),
//     marginBottom: normalize(24),
//   },
//   sectionTitle: {
//     fontSize: normalize(18),
//     fontWeight: '600',
//     color: '#222',
//     marginBottom: normalize(16),
//   },
//   amenitiesContainer: {
//     marginBottom: normalize(24),
//   },
//   amenitiesList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: normalize(16),
//   },
//   amenityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F6F7FB',
//     padding: normalize(8),
//     borderRadius: normalize(8),
//     minWidth: normalize(100),
//   },
//   amenityText: {
//     marginLeft: normalize(8),
//     fontSize: normalize(14),
//     color: '#666',
//   },
//   availabilityContainer: {
//     marginBottom: normalize(24),
//   },
//   availabilityRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: normalize(8),
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   dayText: {
//     fontSize: normalize(14),
//     color: '#222',
//     fontWeight: '500',
//   },
//   hoursText: {
//     fontSize: normalize(14),
//     color: '#666',
//   },
//   galleryContainer: {
//     marginBottom: normalize(24),
//   },
//   galleryImage: {
//     width: normalize(200),
//     height: normalize(150),
//     borderRadius: normalize(8),
//     marginRight: normalize(8),
//   },
//   bookButton: {
//     backgroundColor: '#8d8ff3',
//     margin: normalize(16),
//     borderRadius: normalize(12),
//     paddingVertical: normalize(16),
//     alignItems: 'center',
//   },
//   bookButtonText: {
//     color: '#fff',
//     fontSize: normalize(18),
//     fontWeight: '600',
//   },
// }); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  imageContainer: {
    width: '100%',
    height: normalize(280),
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: normalize(80),
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    padding: normalize(16),
  },
  backButton: {
    position: 'absolute',
    top: normalize(16),
    left: normalize(16),
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shareButton: {
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoContainer: {
    padding: normalize(24),
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    marginTop: normalize(-30),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  spaceTitle: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: '#2A2A3C',
    marginBottom: normalize(12),
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
    backgroundColor: 'rgba(141, 143, 243, 0.1)',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(20),
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: normalize(14),
    color: '#8D8FF3',
    marginLeft: normalize(6),
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: normalize(20),
    backgroundColor: '#F8F9FF',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(16),
    alignSelf: 'flex-start',
  },
  price: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: '#8D8FF3',
    letterSpacing: -0.5,
  },
  perText: {
    fontSize: normalize(14),
    color: '#8D8FF3',
    marginLeft: normalize(4),
    opacity: 0.8,
  },
  description: {
    fontSize: normalize(15),
    color: '#4A4A65',
    lineHeight: normalize(24),
    marginBottom: normalize(28),
    letterSpacing: 0.2,
  },
  sectionContainer: {
    marginBottom: normalize(28),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    padding: normalize(20),
    elevation: 2,
    shadowColor: '#8D8FF3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(16),
    letterSpacing: 0.2,
  },
  amenitiesContainer: {
    marginBottom: normalize(28),
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(12),
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(141, 143, 243, 0.08)',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(14),
    borderRadius: normalize(12),
    minWidth: normalize(110),
    marginBottom: normalize(8),
  },
  amenityText: {
    marginLeft: normalize(8),
    fontSize: normalize(14),
    color: '#4A4A65',
    fontWeight: '500',
  },
  availabilityContainer: {
    marginBottom: normalize(28),
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(141, 143, 243, 0.1)',
  },
  dayText: {
    fontSize: normalize(15),
    color: '#2A2A3C',
    fontWeight: '600',
  },
  hoursText: {
    fontSize: normalize(15),
    color: '#4A4A65',
    fontWeight: '500',
  },
  galleryContainer: {
    marginBottom: normalize(28),
  },
  galleryImage: {
    width: normalize(220),
    height: normalize(160),
    borderRadius: normalize(16),
    marginRight: normalize(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    backgroundColor: '#8D8FF3',
    margin: normalize(24),
    borderRadius: normalize(16),
    paddingVertical: normalize(18),
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#8D8FF3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusBadge: {
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
    backgroundColor: '#4CD964',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(20),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '700',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(24),
    backgroundColor: '#F8F9FF',
    padding: normalize(16),
    borderRadius: normalize(16),
  },
  hostImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(12),
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#2A2A3C',
    marginBottom: normalize(4),
  },
  hostTitle: {
    fontSize: normalize(14),
    color: '#4A4A65',
  },
  contactButton: {
    backgroundColor: 'rgba(141, 143, 243, 0.15)',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(12),
  },
  contactButtonText: {
    color: '#8D8FF3',
    fontSize: normalize(14),
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(141, 143, 243, 0.1)',
    marginVertical: normalize(24),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: normalize(8),
  },
  ratingText: {
    fontSize: normalize(14),
    color: '#4A4A65',
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: normalize(14),
    color: '#8D8FF3',
    fontWeight: '500',
    marginLeft: normalize(4),
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: normalize(16),
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: normalize(14),
    color: '#4A4A65',
    marginLeft: normalize(8),
  },
  mapContainer: {
    height: normalize(200),
    marginBottom: normalize(24),
    borderRadius: normalize(16),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  calendarContainer: {
    marginBottom: normalize(24),
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(12),
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    padding: normalize(12),
    borderRadius: normalize(12),
    marginHorizontal: normalize(4),
    alignItems: 'center',
  },
  dateButtonSelected: {
    backgroundColor: 'rgba(141, 143, 243, 0.15)',
  },
  dateText: {
    fontSize: normalize(14),
    color: '#4A4A65',
    fontWeight: '500',
  },
  dateTextSelected: {
    color: '#8D8FF3',
    fontWeight: '600',
  },
  bookingInfoContainer: {
    backgroundColor: '#F8F9FF',
    padding: normalize(16),
    borderRadius: normalize(16),
    marginBottom: normalize(24),
  },
  bookingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(12),
  },
  bookingInfoLabel: {
    fontSize: normalize(14),
    color: '#4A4A65',
  },
  bookingInfoValue: {
    fontSize: normalize(14),
    color: '#2A2A3C',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(141, 143, 243, 0.1)',
  },
  totalLabel: {
    fontSize: normalize(16),
    color: '#2A2A3C',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: normalize(18),
    color: '#8D8FF3',
    fontWeight: '700',
  },
});