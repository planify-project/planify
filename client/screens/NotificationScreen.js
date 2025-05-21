import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { SocketContext } from '../context/SocketContext';
import api from '../configs/api';
import { Ionicons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const { socket, notifications, setNotifications } = useContext(SocketContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (socket) {
      // Listen for new notifications
      socket.on('newBooking', (data) => {
        console.log('Received new booking notification:', data);
        setNotifications(prev => [data.notification, ...prev]);
      });

      // Listen for booking responses
      socket.on('bookingResponse', (data) => {
        console.log('Received booking response notification:', data);
        setNotifications(prev => [data.notification, ...prev]);
      });

      // Listen for deleted notifications
      socket.on('notificationDeleted', (data) => {
        console.log('Notification deleted:', data);
        setNotifications(prev => prev.filter(n => n.id !== data.notificationId));
      });

      // Listen for dismissed notifications
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
      console.log('1. Starting to fetch notifications...');
      
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('2. No authenticated user found in Firebase');
        throw new Error('No authenticated user found');
      }

      // First get the user's database ID
      const userResponse = await api.get(`/users/firebase/${user.uid}`);
      if (!userResponse.data.success || !userResponse.data.data?.id) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;
      console.log('3. Database user ID:', dbUserId);

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await api.get(`/notifications/user/${dbUserId}?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('4. Notifications response:', response.data);

      if (response.data.success) {
        console.log('5. Setting notifications:', response.data.data);
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

  const handleDeleteNotification = async (notification) => {
    try {
      console.log('Starting to delete notification:', notification);
      
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
      console.log('Got database user ID:', dbUserId);
      
      // Optimistically remove from UI
      console.log('Removing notification from UI');
      setNotifications(prev => {
        const filtered = prev.filter(n => n.id !== notification.id);
        console.log('Updated notifications after removal:', filtered);
        return filtered;
      });
      
      // Delete the notification
      console.log('Sending delete request to server');
      const response = await api.delete(`/notifications/${notification.id}`, {
        data: { userId: dbUserId }
      });
      
      console.log('Server response:', response.data);
      
      // Only show error if the server explicitly indicates failure
      if (response.data && response.data.success === false) {
        console.log('Delete failed, restoring notification');
        // If delete failed, restore the notification
        setNotifications(prev => {
          const restored = [...prev, notification];
          console.log('Restored notifications:', restored);
          return restored;
        });
        throw new Error(response.data.message || 'Failed to delete notification');
      }

      // If we get here, the deletion was successful
      console.log('Delete successful');
      
    } catch (error) {
      // Only show error alert if it's not a successful deletion
      if (error.message !== 'No error') {
        console.error('Error deleting notification:', error);
        Alert.alert(
          'Error',
          error.message || 'Failed to delete notification. Please try again.'
        );
      }
    }
  };

  const handleNotificationPress = (notification) => {
    if (notification.type === 'booking_request' || notification.type === 'booking_response') {
      Alert.alert(
        notification.type === 'booking_request' ? 'Booking Request' : 'Booking Response',
        notification.message,
        [
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => handleDeleteNotification(notification)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } else if (notification.type === 'booking_cancelled') {
      // Navigate to the booking details
      navigation.navigate('BookingDetails', { bookingId: notification.booking_id });
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      console.log('Starting to dismiss notification:', notificationId);
      
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
      console.log('Got database user ID:', dbUserId);
      
      // Optimistically update the UI
      console.log('Updating UI optimistically');
      setNotifications(prev => {
        const updated = prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        );
        console.log('Updated notifications:', updated);
        return updated;
      });
      
      console.log('Sending dismiss request to server');
      const response = await api.put(`/notifications/${notificationId}/dismiss`, {
        userId: dbUserId
      });
      
      console.log('Server response:', response.data);
      
      if (!response.data.success) {
        console.log('Dismiss failed, reverting UI');
        // If the dismiss failed, revert the UI change
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId 
              ? { ...n, is_read: false }
              : n
          )
        );
        throw new Error(response.data.message || 'Failed to dismiss notification');
      }
      
      // Force a refresh of notifications to ensure sync
      console.log('Dismiss successful, refreshing notifications');
      fetchNotifications();
      
    } catch (error) {
      console.error('Error dismissing notification:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to dismiss notification. Please try again.'
      );
    }
  };

  // Initial fetch and setup refresh interval
  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const refreshInterval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
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
        case 'message':
          return 'chatbubble';
        case 'review':
          return 'star';
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
        case 'message':
          return '#2196F3';
        case 'review':
          return '#FFC107';
        default:
          return '#757575';
      }
    };

    return (
      <View style={styles.notificationContainer}>
        <TouchableOpacity
          style={[styles.notificationItem, { borderLeftColor: getColor() }]}
          onPress={() => handleNotificationPress(item)}
        >
          <View style={styles.notificationIcon}>
            <Ionicons name={getIcon()} size={24} color={getColor()} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>
              {new Date(item.created_at || item.createdAt).toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
        
        {(item.type === 'booking_request' || item.type === 'booking_response') && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteNotification(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        )}
        
        {item.type === 'booking_cancelled' && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => handleDismissNotification(item.id)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color="#ff3b30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0000ff']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color="#757575" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
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
    backgroundColor: '#f5f5f5', 
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
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
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  deleteButton: {
    padding: 12,
    marginLeft: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dismissButton: {
    padding: 12,
    marginLeft: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default NotificationScreen;
