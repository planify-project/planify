import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSocket } from '../context/SocketContext';

const NotificationBadge = () => {
  const { notifications } = useSocket();
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (unreadCount === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationBadge;
