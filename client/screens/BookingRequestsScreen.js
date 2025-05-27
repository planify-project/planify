import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';
import { useSocket } from '../context/SocketContext';
import { useNavigation } from '@react-navigation/native';

export default function BookingRequestsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      setRefreshing(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/respond`, {
        response: 'accepted'
      });

      if (response.data.success) {
        Alert.alert('Success', 'Booking request accepted');
        loadBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      Alert.alert('Error', 'Failed to accept booking request');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/respond`, {
        response: 'rejected'
      });

      if (response.data.success) {
        Alert.alert('Success', 'Booking request rejected');
        loadBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      Alert.alert('Error', 'Failed to reject booking request');
    }
  };

  const handleChatPress = (booking) => {
    console.log('Chat button pressed for booking:', booking);
    navigation.navigate('Chat', {
      senderId: auth.currentUser?.uid, // Assuming auth.currentUser contains the logged-in user's ID
      receiverId: booking.service?.provider_id // Assuming provider_id is the receiver's ID
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

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAccept(item.id)}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(item.id)}
          >
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => handleChatPress(item)}
      >
        <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
        <Text style={[styles.chatButtonText, { color: theme.primary }]}>Chat with Customer</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadBookings();
            }}
            colors={[theme.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No booking requests yet
            </Text>
          </View>
        }
      />
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontWeight: '600',
  },
  bookingDetails: {
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  chatButtonText: {
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});