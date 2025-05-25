import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getImageUrl } from '../configs/url';

export default function ServicesScreen() {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [space, setSpace] = useState('');
  const [phone, setPhone] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadBookings, setUnreadBookings] = useState(0);
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    fetchServices();
    fetchUnreadBookings();
  }, []);

  const fetchUnreadBookings = async () => {
    try {
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      if (userResponse.data.success) {
        const dbUserId = userResponse.data.data.id;
        const response = await api.get(`/bookings/provider/${dbUserId}/unread`);
        setUnreadBookings(response.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread bookings:', error);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching services...');
      const response = await api.get('/services?type=service');
      
      if (!response.data) {
        throw new Error('No data received');
      }
      
      console.log('Services fetched:', response.data);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(day.timestamp);
    selectedDate.setHours(0, 0, 0, 0);
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleBook = async () => {
    if (!selectedService) {
      setPopupMessage('Please select a service first');
      setPopupSuccess(false);
      setPopupVisible(true);
      return;
    }
    if (!space || !date || !phone) {
      setPopupMessage('Please fill all fields');
      setPopupSuccess(false);
      setPopupVisible(true);
      return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
      setPopupMessage('Please select a future date');
      setPopupSuccess(false);
      setPopupVisible(true);
      return;
    }

    try {
      // Show loading state
      setLoading(true);

      // First get the user's database ID
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      console.log('User response:', userResponse.data);
      
      if (!userResponse.data.success) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;
      console.log('Database user ID:', dbUserId);

      const bookingData = {
        userId: dbUserId, // Use database user ID instead of Firebase UID
        serviceId: selectedService.id,
        date: date.toISOString(), // Ensure date is in ISO string format
        location: space,
        phone: phone,
      };

      console.log('Sending booking request:', bookingData);
      const response = await api.post('/bookings', bookingData);
      console.log('Booking response:', response.data);

      if (response.data.success) {
        // Close the booking modal
        setBookingModalVisible(false);
        
        // Show success message
        setPopupMessage('Booking request sent successfully! The service provider will be notified.');
        setPopupSuccess(true);
        setPopupVisible(true);
        
        // Reset form
        setSpace('');
        setPhone('');
        setDate(null);
        setSelectedService(null);
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setPopupMessage(err.response?.data?.message || 'Failed to send booking request. Please try again.');
      setPopupSuccess(false);
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Services</Text>
        <TouchableOpacity
          style={[styles.bookingRequestsButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('BookingRequests')}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.bookingRequestsText}>Booking Requests</Text>
          {unreadBookings > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadBookings}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: getImageUrl(item.image_url) || 'https://picsum.photos/300/300' }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{item.title}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
              <Text style={styles.servicePrice}>${item.price}</Text>
              <TouchableOpacity
                style={styles.reserveBtn}
                onPress={() => {
                  setSelectedService(item);
                  setBookingModalVisible(true);
                }}
              >
                <Text style={styles.reserveBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={bookingModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book: {selectedService?.title}</Text>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {date ? date.toLocaleDateString() : "Select a date"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <View style={styles.datePickerContainer}>
                      <Calendar
                        onDayPress={handleDateSelect}
                        minDate={new Date().toISOString().split('T')[0]}
                        markedDates={{
                          [date?.toISOString().split('T')[0]]: { selected: true, selectedColor: '#6C63FF' }
                        }}
                        theme={{
                          todayTextColor: '#6C63FF',
                          selectedDayBackgroundColor: '#6C63FF',
                          arrowColor: '#6C63FF',
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.confirmButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Place</Text>
              <TextInput
                placeholder="Enter event place"
                style={styles.input}
                value={space}
                onChangeText={setSpace}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity
              style={[styles.bookBtn, (!date || !space || !phone) && styles.bookBtnDisabled]}
              onPress={handleBook}
              disabled={!date || !space || !phone}
            >
              <Text style={styles.bookBtnText}>Confirm Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setBookingModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={popupVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', minWidth: 250 }}>
            {loading ? (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6C63FF', marginBottom: 12 }}>
                  Processing...
                </Text>
                <ActivityIndicator size="large" color="#6C63FF" />
              </>
            ) : (
              <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: popupSuccess ? '#00B894' : '#FF3B30', marginBottom: 12 }}>
              {popupSuccess ? 'Success' : 'Error'}
            </Text>
            <Text style={{ fontSize: 16, color: '#333', marginBottom: 20, textAlign: 'center' }}>{popupMessage}</Text>
                <TouchableOpacity 
                  onPress={() => setPopupVisible(false)} 
                  style={{ 
                    backgroundColor: popupSuccess ? '#00B894' : '#FF3B30', 
                    borderRadius: 8, 
                    paddingVertical: 10, 
                    paddingHorizontal: 24 
                  }}
                >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  serviceContent: {
    padding: 20,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  reserveBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  reserveBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2C3E50',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  bookBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookBtnDisabled: {
    backgroundColor: '#ccc',
  },
  bookBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  bookingRequestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  bookingRequestsText: {
    color: '#fff',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
