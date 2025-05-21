import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../../context/SocketContext';
import { styles } from './styles';

const HomeHeader = ({ 
  loading, 
  city, 
  errorMsg, 
  onLocationPress, 
  onNotificationPress
}) => {
  const { notifications } = useSocket();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.smallText}>Current location</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="location-outline" size={16} color="#000" />
          {loading ? (
            <ActivityIndicator size="small" style={{ marginLeft: 4 }} />
          ) : (
            <Text style={styles.locationText}>{city || errorMsg || 'Detecting...'}</Text>
          )}
          <TouchableOpacity onPress={onLocationPress} style={{ marginLeft: 8 }}>
            <Ionicons name="pencil-outline" size={16} color="#4f78f1" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications-outline" size={24} color="#000" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;