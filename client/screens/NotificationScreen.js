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
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
