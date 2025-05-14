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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import { auth } from '../configs/firebase_config';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || 'User',
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid
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
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, { color: theme.text }]}>{user?.displayName || 'User'}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
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

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={[styles.menuText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: normalize(20),
  },
  profileImage: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    marginBottom: normalize(16),
  },
  name: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: normalize(8),
  },
  email: {
    fontSize: normalize(16),
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
  menuContainer: {
    padding: normalize(16),
  },
  menuItem: {
    padding: normalize(16),
    borderRadius: normalize(8),
    marginBottom: normalize(12),
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