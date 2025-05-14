import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function NotificationScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const { notifications, setNotifications, joinUserRoom, isConnected, error } = useSocket();
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const userId = route.params?.userId || 1;

  useEffect(() => {
    if (isConnected) {
      joinUserRoom(userId);
    } else if (error) {
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  }, [isConnected, error]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filterType]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.API_BASE || 'http://172.20.10.3:3000/api'}/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      Alert.alert(
        'Error',
        'Failed to fetch notifications. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${process.env.API_BASE || 'http://172.20.10.3:3000/api'}/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      Alert.alert(
        'Error',
        'Failed to mark notification as read. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const filterNotifications = () => {
    if (filterType === 'all') {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter((n) => n.type === filterType);
      setFilteredNotifications(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.is_read && styles.readCard]}
      onPress={() => markAsRead(item.id)}
    >
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      {item.type === 'booking' && (
        <View style={styles.bookingActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleBookingResponse(item.booking_id, 'confirmed')}
          >
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleBookingResponse(item.booking_id, 'canceled')}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleBookingResponse = async (bookingId, response) => {
    try {
      await axios.post(`${process.env.API_BASE || 'http://192.168.128.72:3000/api'}/bookings/${bookingId}/respond`, {
        response
      });
      // The socket will handle updating the notifications
    } catch (err) {
      console.error('Error responding to booking:', err);
      Alert.alert(
        'Error',
        'Failed to respond to booking. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.filterRow}>
        {['all', 'booking', 'response'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filterType === type && styles.activeFilterButton]}
            onPress={() => setFilterType(type)}
          >
            <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5D5FEE" />
      ) : filteredNotifications.length === 0 ? (
        <Text style={styles.message}>No {filterType} notifications.</Text>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FC', padding: normalize(16) },
  title: { fontSize: normalize(24), fontWeight: 'bold', marginBottom: normalize(8), color: '#5D5FEE', alignSelf: 'center' },
  message: { fontSize: normalize(16), color: '#888', alignSelf: 'center', marginTop: normalize(24) },
  card: {
    backgroundColor: '#e0e7ff',
    padding: normalize(12),
    marginBottom: normalize(12),
    borderRadius: normalize(8),
  },
  readCard: {
    backgroundColor: '#cbd5e1',
  },
  notificationTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    marginTop: normalize(4),
    color: '#555',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: normalize(12),
  },
  filterButton: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    marginHorizontal: normalize(4),
    borderRadius: normalize(20),
    backgroundColor: '#E0E7FF',
  },
  activeFilterButton: {
    backgroundColor: '#5D5FEE',
  },
  filterText: {
    color: '#333',
    fontWeight: '600',
  },
  activeFilterText: {
    color: 'white',
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(12),
  },
  actionButton: {
    flex: 1,
    paddingVertical: normalize(8),
    borderRadius: normalize(6),
    marginHorizontal: normalize(4),
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#00B894',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: normalize(14),
  },
});
