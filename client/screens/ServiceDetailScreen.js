import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../configs/api';
import BookingModal from '../components/BookingModal';
import { useSocket } from '../context/SocketContext';
import { getAuth } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native';
import { getImageUrl } from '../config/index';

export default function ServiceDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { service } = route.params;
  const { socket } = useSocket();
  const auth = getAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const isProvider = auth.currentUser?.uid === service.provider_id;

  const handleDelete = async () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
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
              await api.delete(`/services/${service.id}`);
              Alert.alert('Success', 'Service deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditService', { service });
  };

  const handleChat = () => {
    navigation.navigate('Chat', { 
      recipientId: service.provider_id,
      serviceId: service.id,
      serviceTitle: service.title
    });
  };

  const handleBooking = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to book a service');
      return;
    }

    // Validate required fields
    if (!selectedDate || !selectedSpace || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // First get the user's database ID
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      console.log('User response:', userResponse.data);
      
      if (!userResponse.data.success) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;
      console.log('Database user ID:', dbUserId);

      // Format the booking payload
      const bookingPayload = {
        userId: dbUserId, // Use the database user ID instead of Firebase UID
        serviceId: service.id,
        date: selectedDate,
        location: selectedSpace,
        phone: phoneNumber
      };

      console.log('Creating booking with payload:', bookingPayload);

      // Close the modal before making the request
      setShowBookingModal(false);

      const response = await api.post('/bookings', bookingPayload);

      console.log('Booking response:', response.data);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your booking request has been sent. The service provider will be notified and can accept or reject your request.',
          [{ text: 'OK' }]
        );

        // Listen for booking response
        if (socket) {
          socket.on('bookingResponse', (data) => {
            if (data.notification.bookingId === response.data.data.booking.id) {
              Alert.alert(
                'Booking Update',
                data.notification.message,
                [{ text: 'OK' }]
              );
            }
          });
        }
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
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={{ uri: getImageUrl(service.imageUrl) || 'https://picsum.photos/300/300' }}
        style={styles.serviceImage}
        onError={(e) => {
          console.error('Image loading error:', {
            serviceId: service.id,
            imageUrl: service.imageUrl,
            error: e.nativeEvent
          });
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{service.title}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>{service.price} DT</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.text }]}>{service.description}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Details</Text>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Category:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{service.category || 'Not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Duration:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{service.duration || 'Not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Availability:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{service.availability || 'Not specified'}</Text>
          </View>
        </View>

        <View style={[styles.buttonContainer, { backgroundColor: theme.card }]}>
          {isProvider ? (
            // Provider's buttons
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleEdit}
              >
                <Ionicons name="create-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.error }]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Customer's buttons
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={() => setShowBookingModal(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.secondary }]}
                onPress={handleChat}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {!isProvider && (
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowBookingModal(true)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}

      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBooking}
        service={service}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSpace={selectedSpace}
        setSelectedSpace={setSelectedSpace}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  serviceImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookButton: {
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});