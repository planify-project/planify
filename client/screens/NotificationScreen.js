import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

const { width } = Dimensions.get('window');
const scale = width / 375;
const API_BASE = process.env.API_BASE || 'http://172.20.10.3:3000/api';

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
      const res = await axios.get(`${API_BASE}/notifications/user/${userId}`);
      if (res.data.success) {
        setNotifications(res.data.data);
      } else {
        throw new Error(res.data.message || 'Failed to fetch notifications');
      }
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
      const res = await axios.patch(`${API_BASE}/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      } else {
        throw new Error(res.data.message || 'Failed to mark notification as read');
      }
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
      const res = await axios.patch(`${API_BASE}/bookings/${bookingId}/respond`, {
        response
      });
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to respond to booking');
      }
      // Refresh notifications after responding
      fetchNotifications();
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
        {['all', 'booking', 'booking_response'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filterType === type && styles.activeFilterButton]}
            onPress={() => setFilterType(type)}
          >
            <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
              {type === 'all' ? 'ALL' : type === 'booking' ? 'BOOKINGS' : 'RESPONSES'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5D5FEE" />
      ) : filteredNotifications.length === 0 ? (
        <Text style={styles.message}>No {filterType === 'all' ? '' : filterType} notifications.</Text>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F6FC', 
    padding: normalize(16) 
  },
  listContainer: {
    paddingBottom: normalize(16)
  },
  title: { 
    fontSize: normalize(24), 
    fontWeight: 'bold', 
    marginBottom: normalize(16), 
    color: '#5D5FEE', 
    alignSelf: 'center' 
  },
  message: { 
    fontSize: normalize(16), 
    color: '#888', 
    alignSelf: 'center', 
    marginTop: normalize(24) 
  },
  card: {
    backgroundColor: '#fff',
    padding: normalize(16),
    marginBottom: normalize(12),
    borderRadius: normalize(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  readCard: {
    backgroundColor: '#f8fafc',
    opacity: 0.8,
  },
  notificationTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: normalize(4),
  },
  notificationMessage: {
    fontSize: normalize(14),
    color: '#64748b',
    lineHeight: normalize(20),
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: normalize(16),
    backgroundColor: '#fff',
    padding: normalize(8),
    borderRadius: normalize(12),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButton: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    marginHorizontal: normalize(4),
    borderRadius: normalize(20),
    backgroundColor: '#f1f5f9',
  },
  activeFilterButton: {
    backgroundColor: '#5D5FEE',
  },
  filterText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: normalize(12),
  },
  activeFilterText: {
    color: '#fff',
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(12),
    gap: normalize(8),
  },
  actionButton: {
    flex: 1,
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: normalize(14),
  },
});
