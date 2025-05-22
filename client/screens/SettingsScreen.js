// import React, { useContext, useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions
// } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../context/AuthContext';
// import { getAuth } from 'firebase/auth';

// const { width } = Dimensions.get('window');
// const scale = width / 375;
// function normalize(size) {
//   return Math.round(scale * size);
// }

// export default function SettingsScreen() {
//   const navigation = useNavigation();
//   const { logout } = useContext(AuthContext);
//   const [user, setUser] = useState(null);
//   const auth = getAuth();

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     if (currentUser) {
//       setUser({
//         displayName: currentUser.displayName || 'User',
//         email: currentUser.email,
//         photoURL: currentUser.photoURL,
//         uid: currentUser.uid
//       });
//     }
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Auth' }],
//       });
//     } catch (err) {
//       console.error('Logout failed:', err.message);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: normalize(40) }}>
//       <View style={styles.profileCard}>
//         <Image
//           source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
//           style={styles.avatar}
//         />
//         <View style={{ flex: 1 }}>
//           <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
//           <Text style={styles.profileHandle}>{user?.email}</Text>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
//           <Ionicons name="pencil" size={normalize(22)} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.section}>
//         <TouchableOpacity 
//           style={styles.row}
//           onPress={() => {
//             console.log('Navigating to Profile...');
//             navigation.navigate('Profile');
//           }}
//         >
//           <Ionicons name="person-outline" size={normalize(22)} color="#4f78f1" />
//           <View style={styles.rowText}>
//             <Text style={styles.rowTitle}>My Account</Text>
//             <Text style={styles.rowSubtitle}>View your profile information</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.row}>
//           <Ionicons name="people-outline" size={normalize(22)} color="#4f78f1" />
//           <View style={styles.rowText}>
//             <Text style={styles.rowTitle}>Saved Beneficiary</Text>
//             <Text style={styles.rowSubtitle}>Manage your saved beneficiary</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.row}>
//           <Ionicons name="shield-checkmark-outline" size={normalize(22)} color="#4f78f1" />
//           <View style={styles.rowText}>
//             <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
//             <Text style={styles.rowSubtitle}>Further secure your account for safety</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.row} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={normalize(22)} color="#4f78f1" />
//           <View style={styles.rowText}>
//             <Text style={styles.rowTitle}>Log out</Text>
//             <Text style={styles.rowSubtitle}>Log out of your account</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.section}>
//         <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Help')}>
//           <Ionicons name="help-circle-outline" size={normalize(22)} color="#4f78f1" />
//           <View style={styles.rowText}>
//             <Text style={styles.rowTitle}>Help & Support</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('About')}>
//           <Ionicons name="information-circle-outline" size={normalize(22)} color="#4f78f1" />
//           <View style={styles.rowText}>
//             <Text style={styles.rowTitle}>About App</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={normalize(20)} color="#ccc" />
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F6FC',
//     paddingHorizontal: 0,
//     padding: normalize(16),
//   },
//   profileCard: {
//     backgroundColor: '#4f78f1',
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: normalize(16),
//     marginHorizontal: normalize(18),
//     padding: normalize(18),
//     marginBottom: normalize(18),
//     marginTop: 0,
//   },
//   avatar: {
//     width: normalize(56),
//     height: normalize(56),
//     borderRadius: normalize(28),
//     marginRight: normalize(16),
//     borderWidth: normalize(2),
//     borderColor: '#fff',
//   },
//   profileName: { color: '#fff', fontWeight: 'bold', fontSize: normalize(18) },
//   profileHandle: { color: '#e0e0ff', fontSize: normalize(14), marginTop: normalize(2) },
//   section: {
//     backgroundColor: '#fff',
//     borderRadius: normalize(16),
//     marginHorizontal: normalize(18),
//     marginBottom: normalize(18),
//     paddingVertical: normalize(4),
//     paddingHorizontal: 0,
//     elevation: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: normalize(16),
//     paddingHorizontal: normalize(18),
//     borderBottomWidth: 1,
//     borderBottomColor: '#F4F6FC',
//   },
//   rowText: { flex: 1, marginLeft: normalize(14) },
//   rowTitle: { fontSize: normalize(16), fontWeight: 'bold', color: '#222' },
//   rowSubtitle: { fontSize: normalize(13), color: '#888', marginTop: normalize(2) },
// });

import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform
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

  // Get first letter of name for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: normalize(40) }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account preferences</Text>
      </View>

      <View style={styles.profileCardContainer}>
        <View style={styles.profileCard}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{getInitials(user?.displayName)}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil" size={normalize(18)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.row}
          onPress={() => {
            console.log('Navigating to Profile...');
            navigation.navigate('Profile');
          }}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(108, 111, 209, 0.1)' }]}>
            <Ionicons name="person-outline" size={normalize(20)} color="#6C6FD1" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>My Account</Text>
            <Text style={styles.rowSubtitle}>View your profile information</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(18)} color="#BBBBC9" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(108, 111, 209, 0.1)' }]}>
            <Ionicons name="people-outline" size={normalize(20)} color="#6C6FD1" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Saved Beneficiary</Text>
            <Text style={styles.rowSubtitle}>Manage your saved beneficiary</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(18)} color="#BBBBC9" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(108, 111, 209, 0.1)' }]}>
            <Ionicons name="shield-checkmark-outline" size={normalize(20)} color="#6C6FD1" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
            <Text style={styles.rowSubtitle}>Further secure your account for safety</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(18)} color="#BBBBC9" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Help')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(108, 111, 209, 0.1)' }]}>
            <Ionicons name="help-circle-outline" size={normalize(20)} color="#6C6FD1" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Help & Support</Text>
            <Text style={styles.rowSubtitle}>Get assistance and answers</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(18)} color="#BBBBC9" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('About')}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(108, 111, 209, 0.1)' }]}>
            <Ionicons name="information-circle-outline" size={normalize(20)} color="#6C6FD1" />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>About App</Text>
            <Text style={styles.rowSubtitle}>Version and information</Text>
          </View>
          <Ionicons name="chevron-forward" size={normalize(18)} color="#BBBBC9" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={normalize(20)} color="#FFFFFF" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    padding: normalize(20),
  },
  header: {
    marginBottom: normalize(24),
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(6),
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: normalize(16),
    color: '#6E6E87',
    fontWeight: '500',
  },
  profileCardContainer: {
    marginBottom: normalize(24),
    borderRadius: normalize(20),
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  profileCard: {
    backgroundColor: '#6C6FD1',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(20),
    padding: normalize(20),
    overflow: 'hidden',
  },
  avatar: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    borderWidth: normalize(2),
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarFallback: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(2),
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: normalize(24),
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: normalize(16),
  },
  profileName: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: normalize(18),
    marginBottom: normalize(4),
  },
  profileEmail: { 
    color: 'rgba(255, 255, 255, 0.8)', 
    fontSize: normalize(14),
  },
  editButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(12),
    marginLeft: normalize(4),
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(20),
    marginBottom: normalize(24),
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 111, 209, 0.08)',
  },
  iconContainer: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(14),
  },
  rowText: { 
    flex: 1,
  },
  rowTitle: { 
    fontSize: normalize(16), 
    fontWeight: '600', 
    color: '#2A2A3C',
    marginBottom: normalize(4),
  },
  rowSubtitle: { 
    fontSize: normalize(14), 
    color: '#6E6E87',
    lineHeight: normalize(18),
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: normalize(8),
  },
  logoutButton: {
    backgroundColor: '#FF3B5E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(16),
    width: '100%',
    shadowColor: '#FF3B5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  logoutIcon: {
    marginRight: normalize(8),
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
  },
});