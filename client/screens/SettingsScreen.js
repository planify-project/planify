import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import { auth } from '../configs/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || 'User',
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          uid: currentUser.uid
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Please sign in to view settings</Text>
        <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: theme.text }]}>{user?.displayName || 'User'}</Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
        </View>
        <View style={styles.profileButtons}>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.profileButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Text style={styles.profileButtonText}>Wishlist</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.primary }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('AddService')}
        >
          <Text style={[styles.settingText, { color: theme.text }]}>Add New Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={[styles.settingText, { color: theme.text }]}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={[styles.settingText, { color: theme.text }]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={[styles.settingText, { color: theme.text }]}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Privacy')}
        >
          <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
  },
  profileInfo: {
    flex: 1,
    marginLeft: normalize(15),
  },
  name: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(4),
  },
  email: {
    fontSize: normalize(14),
  },
  profileButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  profileButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsContainer: {
    padding: normalize(16),
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: normalize(16),
    borderRadius: normalize(8),
    marginBottom: normalize(12),
  },
  settingText: {
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
  errorText: {
    fontSize: normalize(16),
    marginBottom: normalize(16),
  },
  signInButton: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
  },
  signInButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});

