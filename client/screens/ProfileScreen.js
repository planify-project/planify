import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || 'User',
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      });
    }
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={normalize(60)} color="#5D5FEE" />
            </View>
          )}
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Services</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Bookings</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Reviews</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="person-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.menuItemText}>
            <Text style={[styles.menuItemTitle, { color: theme.text }]}>Edit Profile</Text>
            <Text style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}>Update your personal information</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.menuItemText}>
            <Text style={[styles.menuItemTitle, { color: theme.text }]}>Change Password</Text>
            <Text style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}>Update your password</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Ionicons name="notifications-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.menuItemText}>
            <Text style={[styles.menuItemTitle, { color: theme.text }]}>Notification Settings</Text>
            <Text style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}>Manage your notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('MyServices')}
        >
          <Text style={[styles.menuText, { color: theme.text }]}>My Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={[styles.menuText, { color: theme.text }]}>My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.menuText, { color: theme.text }]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: theme.error }]}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: normalize(20),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: normalize(15),
  },
  avatar: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
  },
  avatarPlaceholder: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: normalize(24),
    fontWeight: '600',
    color: '#333',
    marginBottom: normalize(5),
  },
  email: {
    fontSize: normalize(16),
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: normalize(16),
  },
  statBox: {
    alignItems: 'center',
    padding: normalize(16),
    borderRadius: normalize(8),
    width: '30%',
  },
  statNumber: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: normalize(8),
  },
  statLabel: {
    fontSize: normalize(14),
  },
  section: {
    backgroundColor: '#fff',
    marginTop: normalize(20),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    marginLeft: normalize(15),
  },
  menuItemTitle: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: '#333',
    marginBottom: normalize(2),
  },
  menuItemSubtitle: {
    fontSize: normalize(14),
    color: '#666',
  },
  menuContainer: {
    padding: normalize(16),
  },
  menuText: {
    fontSize: normalize(16),
  },
  signOutButton: {
    padding: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginTop: normalize(16),
  },
  signOutText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 