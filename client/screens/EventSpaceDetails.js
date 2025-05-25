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
import { API_BASE, SOCKET_URL } from '../config';

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
  const [isCreator, setIsCreator] = useState(false);
  const auth = getAuth();

  // Initialize Firebase Realtime Database
  const db = getDatabase();
  const notificationsRef = ref(db, 'notifications');

  useEffect(() => {
    checkIfCreator();
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

  const checkIfCreator = async () => {
    try {
      if (!auth.currentUser) {
        setIsCreator(false);
        return;
      }

      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      if (userResponse?.data?.success) {
        const dbUserId = userResponse.data.data.id;
        setIsCreator(space.provider_id === dbUserId);
      }
    } catch (error) {
      console.error('Error checking creator status:', error);
      setIsCreator(false);
    }
  };

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
      console.error('Error fetching availability:', error);
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Remove any leading /uploads/ if it exists
    const cleanPath = imagePath.replace(/^\/uploads\//, '');
    // Use the base URL without /api for static files
    return `${SOCKET_URL}/uploads/${cleanPath}`;
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Event Space',
      'Are you sure you want to delete this event space? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await api.delete(`/event-spaces/${space.id}`);
              if (response?.data?.success) {
                Alert.alert('Success', 'Event space deleted successfully');
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to delete event space');
              }
            } catch (error) {
              console.error('Error deleting event space:', error);
              Alert.alert('Error', 'Failed to delete event space');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditEventSpace', { space });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: getImageUrl(space.images?.[0]) || 'https://via.placeholder.com/400x300' }} 
          style={styles.mainImage} 
        />
        {isCreator && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={handleEdit}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
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

      {/* Book Button - Only show if not the creator */}
      {!isCreator && (
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
      )}

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
  },
  bookButtonDisabled: {
    backgroundColor: '#A5A6F6',
    opacity: 0.7,
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
  actionButtonsContainer: {
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
    flexDirection: 'row',
    gap: normalize(8),
  },
  actionButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});