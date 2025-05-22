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
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.32;

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);
  const auth = getAuth();

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, HEADER_HEIGHT / 2],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [0, -10, -20],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || 'Alex Johnson',
        email: currentUser.email || 'alex.johnson@example.com',
        photoURL: currentUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg',
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
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  const renderMenuItem = (icon, title, subtitle, onPress, iconType = "Ionicons") => {
    const IconComponent = iconType === "Ionicons" ? Ionicons : 
                          iconType === "MaterialCommunityIcons" ? MaterialCommunityIcons : Feather;
    
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconContainer}>
          <IconComponent name={icon} size={22} color="#6C5CE7" />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#A0A0A0" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#6C5CE7', '#8E5CE7']}
          style={styles.gradient}
        >
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Feather name="edit-2" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  transform: [
                    { scale: titleScale },
                    { translateY: titleTranslateY },
                  ],
                },
              ]}
            >
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(108, 92, 231, 0.1)' }]}>
              <Feather name="briefcase" size={20} color="#6C5CE7" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(0, 184, 148, 0.1)' }]}>
              <Feather name="calendar" size={20} color="#00B894" />
            </View>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(253, 121, 168, 0.1)' }]}>
              <Feather name="star" size={20} color="#FD79A8" />
            </View>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Account Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {renderMenuItem(
            "person-outline", 
            "Edit Profile", 
            "Update your personal information",
            () => navigation.navigate('EditProfile')
          )}
          
          {renderMenuItem(
            "lock-closed-outline", 
            "Change Password", 
            "Update your password",
            () => navigation.navigate('ChangePassword')
          )}
          
          {renderMenuItem(
            "notifications-outline", 
            "Notification Settings", 
            "Manage your notifications",
            () => navigation.navigate('NotificationSettings')
          )}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {renderMenuItem(
            "briefcase-outline", 
            "My Services", 
            "Manage your service offerings",
            () => navigation.navigate('MyServices')
          )}
          
          {renderMenuItem(
            "calendar-outline", 
            "My Bookings", 
            "View your upcoming appointments",
            () => navigation.navigate('MyBookings')
          )}
          
          {renderMenuItem(
            "wallet-outline", 
            "Payment Methods", 
            "Manage your payment options",
            () => navigation.navigate('PaymentMethods')
          )}
          
          {renderMenuItem(
            "moon-outline", 
            "Dark Mode", 
            "Change app appearance",
            () => navigation.navigate('AppearanceSettings')
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderMenuItem(
            "help-circle-outline", 
            "Help Center", 
            "Get help with using the app",
            () => navigation.navigate('HelpCenter')
          )}
          
          {renderMenuItem(
            "chatbubble-outline", 
            "Contact Support", 
            "Reach out to our support team",
            () => navigation.navigate('ContactSupport')
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6C5CE7',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  titleContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    paddingTop: HEADER_HEIGHT,
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: width / 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#636E72',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2D3436',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#636E72',
  },
  signOutButton: {
    backgroundColor: '#FD79A8',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#FD79A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#B2BEC3',
  },
});

export default ProfileScreen;