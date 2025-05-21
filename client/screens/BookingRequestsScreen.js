import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';
import { useSocket } from '../context/SocketContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BookingRequestsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const { socket } = useSocket();

  useEffect(() => {
    console.log('BookingRequestsScreen mounted');
    console.log('Socket status:', socket ? 'connected' : 'not connected');
    console.log('Current user:', auth.currentUser?.uid);
    
    loadBookings();
    
    // Listen for new booking requests
    if (socket) {
      console.log('Setting up socket listeners');
      
      // Listen for connection events
      socket.on('connect', () => {
        console.log('Socket connected in BookingRequestsScreen');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected in BookingRequestsScreen');
      });

      socket.on('error', (error) => {
        console.error('Socket error in BookingRequestsScreen:', error);
      });

      // Listen for new bookings
      socket.on('newBooking', (data) => {
        console.log('New booking request received:', data);
        if (data.notification?.type === 'booking_request') {
          console.log('Valid booking request received, refreshing bookings');
          loadBookings();
        }
      });

      // Listen for booking responses
      socket.on('bookingResponse', (data) => {
        console.log('Booking response received:', data);
        loadBookings();
      });
    } else {
      console.log('Socket not available in BookingRequestsScreen');
    }

    return () => {
      if (socket) {
        console.log('Cleaning up socket listeners');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('error');
        socket.off('newBooking');
        socket.off('bookingResponse');
      }
    };
  }, [socket]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log('Loading bookings for user:', auth.currentUser?.uid);
      
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      console.log('User response:', userResponse.data);
      
      if (userResponse.data.success) {
        const dbUserId = userResponse.data.data.id;
        console.log('Database user ID:', dbUserId);
        
        const response = await api.get(`/bookings/provider/${dbUserId}`);
        console.log('Bookings response:', response.data);
        
        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to load bookings');
        }
      } else {
        throw new Error('Failed to get user data');
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingResponse = async (bookingId, status) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status });
      if (response.data.success) {
        // Notify the user through socket
        if (socket) {
          socket.emit('bookingResponse', {
            bookingId,
            status,
            message: `Your booking request has been ${status === 'accepted' ? 'accepted' : 'rejected'}`
          });
        }
        // Refresh the bookings list
        loadBookings();
      }
    } catch (error) {
      console.error('Error responding to booking:', error);
      Alert.alert('Error', 'Failed to respond to booking request');
    }
  };

  const handleChatPress = (booking) => {
    console.log('Chat button pressed for booking:', booking);
    navigation.navigate('Chat', {
      serviceId: booking.serviceId,
      serviceProviderId: booking.service?.provider_id,
      serviceProviderName: booking.service?.provider?.name || 'Service Provider',
      serviceProviderImage: booking.service?.provider?.image_url
    });
  };

  const renderBookingItem = ({ item }) => (
    <View style={[styles.bookingCard, { backgroundColor: theme.card }]}>
      <View style={styles.bookingHeader}>
        <Text style={[styles.serviceTitle, { color: theme.text }]}>{item.service?.title || 'Service'}</Text>
        <Text style={[styles.status, { 
          color: item.status === 'pending' ? '#FFA500' : 
                 item.status === 'accepted' ? '#4CAF50' : '#F44336'
        }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.bookingDetails}>
        <Text style={[styles.detailText, { color: theme.text }]}>
          <Ionicons name="calendar-outline" size={16} color={theme.text} /> {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={[styles.detailText, { color: theme.text }]}>
          <Ionicons name="location-outline" size={16} color={theme.text} /> {item.location || 'No location specified'}
        </Text>
        <Text style={[styles.detailText, { color: theme.text }]}>
          <Ionicons name="call-outline" size={16} color={theme.text} /> {item.phone || 'No phone number'}
        </Text>
        <Text style={[styles.detailText, { color: theme.text }]}>
          <Ionicons name="person-outline" size={16} color={theme.text} /> {item.user?.name || 'User'}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        {item.status === 'pending' ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleBookingResponse(item.id, 'accepted')}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleBookingResponse(item.id, 'rejected')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.chatButton]}
            onPress={() => handleChatPress(item)}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {bookings.length === 0 ? (
        <View style={[styles.centered, { backgroundColor: theme.background }]}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No booking requests yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadBookings}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  chatButton: {
    backgroundColor: '#6C63FF',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 