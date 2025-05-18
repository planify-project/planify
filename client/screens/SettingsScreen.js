import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const auth = getAuth();

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
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: normalize(40) }}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.profileHandle}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="pencil" size={normalize(22)} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.row}
          onPress={() => {
            console.log('Navigating to Profile...');
            navigation.navigate('Profile');
          }}
        >
          <Ionicons name="person-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>My Account</Text>
            <Text style={styles.rowSubtitle}>View your profile information</Text>
          </View>
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
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Help')}>
          <Ionicons name="help-circle-outline" size={normalize(22)} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('About')}>
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
    padding: normalize(16),
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
    borderColor: '#fff',
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
});