import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { SocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../configs/api';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { socket, notifications, setNotifications } = useContext(SocketContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('newBooking', (data) => {
        console.log('Received new booking notification:', data);
        setNotifications(prev => [data.notification, ...prev]);
      });

      socket.on('bookingResponse', (data) => {
        console.log('Received booking response notification:', data);
        setNotifications(prev => [data.notification, ...prev]);
      });

      socket.on('notificationDeleted', (data) => {
        console.log('Notification deleted:', data);
        setNotifications(prev => prev.filter(n => n.id !== data.notificationId));
      });

      socket.on('notificationDismissed', (data) => {
        console.log('Notification dismissed:', data);
        setNotifications(prev => 
          prev.map(n => 
            n.id === data.notificationId 
              ? { ...n, is_read: true }
              : n
          )
        );
      });

      return () => {
        socket.off('newBooking');
        socket.off('bookingResponse');
        socket.off('notificationDeleted');
        socket.off('notificationDismissed');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.dbUser?.id) {
        throw new Error('No user data found');
      }

      // Fetch notifications based on user type
      let response;
      if (user.dbUser.isProvider) {
        // For providers, fetch notifications related to their services
        response = await api.get(`/notifications/provider/${user.dbUser.id}`);
      } else {
        // For regular users, fetch their personal notifications
        response = await api.get(`/notifications/user/${user.dbUser.id}`);
      }

      if (response.data.success) {
        setNotifications(response.data.data);
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (notification) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const userResponse = await api.get(`/users/firebase/${user.uid}`);
      if (!userResponse.data.success || !userResponse.data.data?.id) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;
      
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      
      const response = await api.delete(`/notifications/${notification.id}`, {
        data: { userId: dbUserId }
      });
      
      if (!response.data.success) {
        setNotifications(prev => [...prev, notification]);
        throw new Error(response.data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', error.message || 'Failed to delete notification');
    }
  };

  const handleAcceptBooking = async (notification) => {
    try {
      const response = await api.put(`/bookings/${notification.itemId}/respond`, {
        response: 'accepted'
      });

      if (response.data.success) {
        Alert.alert('Success', 'Booking request accepted');
        handleDeleteNotification(notification);
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      Alert.alert('Error', 'Failed to accept booking request');
    }
  };

  const handleRejectBooking = async (notification) => {
    try {
      const response = await api.put(`/bookings/${notification.itemId}/respond`, {
        response: 'rejected'
      });

      if (response.data.success) {
        Alert.alert('Success', 'Booking request rejected');
        handleDeleteNotification(notification);
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      Alert.alert('Error', 'Failed to reject booking request');
    }
  };

  const handleNotificationPress = (notification) => {
    if (notification.type === 'booking_request') {
      Alert.alert(
        'Booking Request',
        notification.message,
        [
          {
            text: 'Accept',
            style: 'default',
            onPress: () => handleAcceptBooking(notification)
          },
          {
            text: 'Reject',
            style: 'destructive',
            onPress: () => handleRejectBooking(notification)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } else if (notification.type === 'booking_response') {
      Alert.alert(
        'Booking Response',
        notification.message,
        [
          {
            text: 'OK',
            style: 'default',
            onPress: () => handleDeleteNotification(notification)
          }
        ]
      );
    }
  };

  const renderNotification = ({ item }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'booking_request':
          return 'calendar';
        case 'booking_response':
          return 'checkmark-circle';
        case 'booking_cancelled':
          return 'close-circle';
        default:
          return 'notifications';
      }
    };

    const getColor = () => {
      switch (item.type) {
        case 'booking_request':
          return '#4CAF50';
        case 'booking_response':
          return '#2196F3';
        case 'booking_cancelled':
          return '#FF3B30';
        default:
          return '#757575';
      }
    };

    return (
      <TouchableOpacity
        style={[styles.notificationItem, { 
          backgroundColor: theme.card,
          borderLeftColor: getColor(),
          opacity: item.is_read ? 0.7 : 1
        }]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationIcon}>
          <Ionicons name={getIcon()} size={24} color={getColor()} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: theme.textSecondary }]}>
            {item.message}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.textTertiary }]}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
        <View style={styles.notificationActions}>
        {!item.is_read && (
          <View style={[styles.unreadDot, { backgroundColor: getColor() }]} />
        )}
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.card }]}
            onPress={() => {
              Alert.alert(
                'Delete Notification',
                'Are you sure you want to delete this notification?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => handleDeleteNotification(item)
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchNotifications();
            }}
            colors={[theme.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
              You'll see your notifications here when you receive them
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  notificationIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default NotificationScreen;
