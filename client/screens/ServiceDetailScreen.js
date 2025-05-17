import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../configs/api';
import BookingModal from '../components/BookingModal';
import { useSocket } from '../context/SocketContext';
import { getAuth } from 'firebase/auth'; // Replace AWS Amplify with Firebase Auth
import { CommonActions } from '@react-navigation/native';

export default function ServiceDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { service } = route.params;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { socket } = useSocket();
  const auth = getAuth(); // Get Firebase Auth instance

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
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          }
        }
      ]
    );
  };

  const handleBooking = async (bookingData) => {
    try {
      if (!auth.currentUser) {
        Alert.alert('Error', 'Please login to book a service');
        navigation.navigate('Login');
        return;
      }

      // Validate booking data
      if (!bookingData.date || !bookingData.space || !bookingData.phone_number) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Format the booking payload to match server expectations
      const bookingPayload = {
        user_id: auth.currentUser.uid,
        service_id: service.id,
        event_id: "1", // Required field
        date: new Date(bookingData.date).toISOString(),
        space: bookingData.space.trim(),
        phone_number: bookingData.phone_number.replace(/[^0-9]/g, ''),
        status: 'pending'
      };

      console.log('Sending booking request:', bookingPayload);
      const response = await api.post('/bookings', bookingPayload);

      if (response.data.success) {
        setShowBookingModal(false);
        Alert.alert('Success', 'Booking request sent! Waiting for provider response.');

        // Emit socket event for real-time notification
        socket?.emit('newBooking', {
          serviceId: service.id,
          providerId: service.provider_id
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to send booking request'
      );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={{ uri: service.imageUrl || 'https://picsum.photos/300/300' }}
        style={styles.serviceImage}
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

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#5D5FEE' }]}
            onPress={() => {
              console.log('Attempting to navigate to Chat...');
              navigation.dispatch(
                CommonActions.navigate({
                  name: 'Chat',
                  params: {
                    serviceId: service.id,
                    serviceProviderId: service.provider_id,
                    serviceProviderName: service.provider_name || 'Service Provider'
                  }
                })
              );
            }}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Chat</Text>
          </TouchableOpacity>

          {auth.currentUser?.uid === service.provider_id ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('EditService', { service })}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.error }]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.success }]}
              onPress={() => setShowBookingModal(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBooking}
        service={service}
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
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
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});