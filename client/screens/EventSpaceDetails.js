import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../utils/scaling';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';
import EventSpaceBookingModal from '../components/EventSpaceBookingModal';
import { Calendar } from 'react-native-calendars';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';

const { width } = Dimensions.get('window');

const ScheduleTooltip = ({ visible, availability }) => {
  if (!visible) return null;

  return (
    <View style={styles.tooltipContainer}>
      <View style={styles.tooltipArrow} />
      <View style={styles.tooltipContent}>
        <Calendar
          markedDates={availability}
          minDate={new Date().toISOString().split('T')[0]}
          theme={{
            todayTextColor: '#5D5FEE',
            arrowColor: '#5D5FEE',
            textMonthFontSize: normalize(14),
            textDayHeaderFontSize: normalize(12),
            textDayFontSize: normalize(12),
            'stylesheet.calendar.header': {
              dayTextAtIndex0: {
                color: '#FF3B30'
              },
              dayTextAtIndex6: {
                color: '#FF3B30'
              }
            }
          }}
          style={styles.tooltipCalendar}
          hideExtraDays={true}
          disableAllTouchEvents={true}
        />
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function EventSpaceDetails({ route, navigation }) {
  const { space } = route.params;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [showScheduleTooltip, setShowScheduleTooltip] = useState(false);
  const auth = getAuth();

  // Initialize Firebase Realtime Database
  const db = getDatabase();
  const notificationsRef = ref(db, 'notifications');

  useEffect(() => {
    fetchAvailability();
    // Listen for real-time notifications
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Handle new notifications
        Object.values(data).forEach(notification => {
          if (notification.type === 'BOOKING_STATUS_UPDATE' && 
              notification.bookingId === currentBookingId) {
            handleBookingStatusUpdate(notification);
          }
        });
      }
    });

    return () => {
      // Cleanup subscription
      unsubscribe();
    };
  }, []);

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    try {
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

      // Format dates to YYYY-MM-DD
      const startDate = today.toISOString().split('T')[0];
      const endDate = thirtyDaysLater.toISOString().split('T')[0];

      const response = await api.get(`/event-spaces/${space.id}/availability`, {
        params: {
          startDate,
          endDate
        }
      });

      if (response?.data?.success) {
        const markedDates = {};
        Object.entries(response.data.data).forEach(([date, info]) => {
          markedDates[date] = {
            marked: true,
            dotColor: info.available ? '#4CAF50' : '#FF3B30',
            disabled: !info.available,
            price: info.price,
            amenities: info.amenities
          };
        });
        setAvailability(markedDates);
      } else {
        // If no availability data, set all dates as available
        const defaultAvailability = {};
        let currentDate = new Date(today);
        while (currentDate <= thirtyDaysLater) {
          const dateStr = currentDate.toISOString().split('T')[0];
          defaultAvailability[dateStr] = {
            marked: true,
            dotColor: '#4CAF50',
            disabled: false,
            price: space.price
          };
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setAvailability(defaultAvailability);
      }
    } catch (error) {
      // If API fails, set all dates as available
      const defaultAvailability = {};
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      
      let currentDate = new Date(today);
      while (currentDate <= thirtyDaysLater) {
        const dateStr = currentDate.toISOString().split('T')[0];
        defaultAvailability[dateStr] = {
          marked: true,
          dotColor: '#4CAF50',
          disabled: false,
          price: space.price
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setAvailability(defaultAvailability);
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    if (space?.id) {
      fetchAvailability();
    }
  }, [space?.id]);

  const handleBookingStatusUpdate = (notification) => {
    if (notification.status === 'approved') {
      Alert.alert(
        'Booking Approved',
        'Your booking request has been approved!',
        [{ text: 'OK' }]
      );
    } else if (notification.status === 'rejected') {
      Alert.alert(
        'Booking Rejected',
        'Your booking request has been rejected.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBooking = async (bookingData) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to book a space');
      return;
    }

    setLoading(true);
    try {
      // Get user ID from Firebase UID
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);

      if (!userResponse?.data?.success) {
        Alert.alert('Error', userResponse?.data?.message || 'Unable to verify user account');
        return;
      }

      const dbUserId = userResponse.data.data.id;

      // Parse the date string from the modal into a Date object
      const bookingDate = new Date(bookingData.date);

      // Prepare booking data
      const bookingPayload = {
        userId: dbUserId,
        eventSpaceId: space.id,
        // Use the parsed Date object for start and end dates
        startDate: bookingDate.toISOString(),
        endDate: bookingDate.toISOString(),
        phoneNumber: bookingData.phoneNumber,
        status: 'pending',
        createdAt: new Date().toISOString(),
        totalPrice: space.price,
        numberOfGuests: bookingData.numberOfGuests || 1,
        specialRequests: bookingData.specialRequests || ''
      };

      // Submit booking
      const response = await api.post('/event-spaces/bookings', bookingPayload);

      if (response?.data?.success) {
        const bookingId = response.data.data.id;

        // Create notification for admin
        const notificationData = {
          type: 'NEW_BOOKING_REQUEST',
          title: 'New Booking Request',
          message: `New booking request for ${space.name} from ${bookingDate.toLocaleDateString()} to ${bookingDate.toLocaleDateString()}`,
          bookingId: bookingId,
          eventSpaceId: space.id,
          userId: dbUserId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          userEmail: auth.currentUser.email,
          spaceName: space.name,
          price: space.price
        };

        // Send notification
        try {
          await api.post('/notifications/admin', notificationData);
        } catch (notificationError) {
          // Log notification error but continue
          console.error('Notification failed:', notificationError);
        }

        Alert.alert(
          'Success',
          'Your booking request has been sent successfully! The admin will review it shortly.',
          [{ text: 'OK', onPress: () => setShowBookingModal(false) }]
        );
      } else {
        Alert.alert('Error', response?.data?.message || 'Failed to submit booking request');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      Alert.alert('Error', 'An error occurred while submitting your booking request. Please try again later.');
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

        {/* Availability Calendar */}
        <View style={styles.availabilityContainer}>
          <View style={styles.sectionTitleContainer}>
            <TouchableOpacity
              onPress={() => setShowScheduleTooltip(!showScheduleTooltip)}
              style={styles.titleButton}
            >
              <Text style={styles.sectionTitle}>Availability</Text>
              <Ionicons 
                name={showScheduleTooltip ? "chevron-up" : "chevron-down"} 
                size={normalize(20)} 
                color="#5D5FEE" 
                style={styles.titleIcon}
              />
            </TouchableOpacity>
            <ScheduleTooltip 
              visible={showScheduleTooltip} 
              availability={availability}
            />
          </View>
          {loadingAvailability ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D5FEE" />
              <Text style={styles.loadingText}>Restoring availability... Please wait while we reload the schedule. The calendar will soon display the available and unavailable days again.</Text>
            </View>
          ) : (
            <>
              <Calendar
                markedDates={availability}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  todayTextColor: '#5D5FEE',
                  arrowColor: '#5D5FEE',
                }}
                style={styles.calendar}
              />
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                  <Text style={styles.legendText}>Unavailable</Text>
                </View>
              </View>
            </>
          )}
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
        style={[styles.bookButton, loading && styles.bookButtonDisabled]}
        onPress={() => setShowBookingModal(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.bookButtonText}>Book This Space</Text>
        )}
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
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#5D5FEE',
    },
  },
  sectionTitleContainer: {
    position: 'relative',
    marginBottom: normalize(16),
  },
  titleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(8),
  },
  titleIcon: {
    marginLeft: normalize(8),
  },
  tooltipContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    padding: normalize(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: normalize(8),
  },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  tooltipContent: {
    padding: normalize(8),
  },
  tooltipCalendar: {
    borderRadius: normalize(8),
    marginBottom: normalize(8),
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(20),
    marginTop: normalize(8),
    paddingTop: normalize(8),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginRight: normalize(4),
  },
  legendText: {
    fontSize: normalize(12),
    color: '#666',
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
  calendar: {
    borderRadius: 10,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: normalize(20),
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: normalize(8),
    marginVertical: normalize(10),
  },
  loadingText: {
    marginTop: normalize(10),
    fontSize: normalize(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: normalize(20),
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
  bookButtonDisabled: {
    backgroundColor: '#A5A6F6',
    opacity: 0.7,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
  },
}); 