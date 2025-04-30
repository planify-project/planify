import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await axios.get(`http://192.168.43.149:3000/api/users/${user.uid}`);
          setUserProfile(response.data);
          // Fetch user's services
          const servicesResponse = await axios.get(`http://192.168.43.149:3000/api/services/agent/${user.uid}`);
          setServices(servicesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: normalize(40) }}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: userProfile?.profileImage || 'https://randomuser.me/api/portraits/women/44.jpg' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{userProfile?.name || 'Loading...'}</Text>
          <Text style={styles.profileHandle}>@{userProfile?.email?.split('@')[0] || 'user'}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="pencil" size={normalize(22)} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Services</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddService')}
          >
            <Ionicons name="add-circle-outline" size={normalize(24)} color="#5D5FEE" />
          </TouchableOpacity>
        </View>
        
        {services.length > 0 ? (
          services.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceRow}
              onPress={() => navigation.navigate('EditService', { service })}
            >
              <Image
                source={{ uri: service.imageUrl || 'https://via.placeholder.com/50' }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price} DT</Text>
              </View>
              <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No services added yet</Text>
            <TouchableOpacity 
              style={styles.addFirstServiceButton}
              onPress={() => navigation.navigate('AddService')}
            >
              <Text style={styles.addFirstServiceText}>Add Your First Service</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="person-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>My Account</Text>
            <Text style={styles.rowSubtitle}>Make changes to your account</Text>
          </View>
          <MaterialIcons name="error-outline" size={normalize(18)} color="#FF5A5F" style={{ marginRight: normalize(8) }} />
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="people-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Saved Beneficiary</Text>
            <Text style={styles.rowSubtitle}>Manage your saved beneficiary</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
        <View style={styles.row}>
          <Ionicons name="moon-outline" size={normalize(22)} color={theme.primary} />
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Dark Mode</Text>
            <Text style={[styles.rowSubtitle, { color: isDark ? '#aaa' : '#888' }]}>Change your theme to dark mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? theme.primary : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#b3b3ff" }}
          />
        </View>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
            <Text style={styles.rowSubtitle}>Further secure your account for safety</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Log out</Text>
            <Text style={styles.rowSubtitle}>Log out of your account</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="help-circle-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="information-circle-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>About App</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FC',
    paddingHorizontal: 0,
    padding: normalize(16)
  },
  header: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: '#b3b3c6',
    marginTop: normalize(18),
    marginLeft: normalize(18),
    marginBottom: normalize(10),
  },
  profileCard: {
    backgroundColor: '#5D5FEE',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(16),
    marginHorizontal: normalize(18),
    padding: normalize(18),
    marginBottom: normalize(18),
    marginTop: 0,
  },
  avatar: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(28),
    marginRight: normalize(16),
    borderWidth: normalize(2),
    borderColor: '#fff'
  },
  profileName: { color: '#fff', fontWeight: 'bold', fontSize: normalize(18) },
  profileHandle: { color: '#e0e0ff', fontSize: normalize(14), marginTop: normalize(2) },
  section: {
    backgroundColor: '#fff',
    borderRadius: normalize(16),
    marginHorizontal: normalize(18),
    marginBottom: normalize(18),
    paddingVertical: normalize(4),
    paddingHorizontal: 0,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(18),
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FC',
  },
  rowText: { flex: 1, marginLeft: normalize(14) },
  rowTitle: { fontSize: normalize(16), fontWeight: 'bold', color: '#222' },
  rowSubtitle: { fontSize: normalize(13), color: '#888', marginTop: normalize(2) },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FC',
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#222',
  },
  addButton: {
    padding: normalize(4),
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(18),
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FC',
  },
  serviceImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(8),
    marginRight: normalize(12),
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#222',
  },
  servicePrice: {
    fontSize: normalize(14),
    color: '#5D5FEE',
    marginTop: normalize(2),
  },
  emptyState: {
    padding: normalize(20),
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: normalize(16),
    color: '#888',
    marginBottom: normalize(12),
  },
  addFirstServiceButton: {
    backgroundColor: '#5D5FEE',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
  },
  addFirstServiceText: {
    color: '#fff',
    fontSize: normalize(14),
    fontWeight: 'bold',
  },
});

