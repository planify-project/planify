import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../components/CustomAlert';

// API configuration
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    console.log('Making request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      code: error.code,
      url: error.config?.url,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

const { width } = Dimensions.get('window');

export default function CreateEventScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('space');
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({
    venue: null,
    services: [],
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'error'
  });

  const fetchData = async (type) => {
    try {
      setLoading(true);
      setError(null);

      let endpoint;
      let serviceType;
      
      switch(type) {
        case 'space':
          endpoint = '/event-spaces';
          break;
        case 'services':
          endpoint = '/services';
          serviceType = 'service';
          break;
        default:
          throw new Error('Invalid type');
      }

      const url = serviceType ? `${endpoint}?serviceType=${serviceType}` : endpoint;
      console.log(`Fetching ${type} data from: ${API_BASE}${url}`);
      
      const response = await api.get(url);
      console.log(`${type} response:`, response.data);

      if (!response.data) {
        throw new Error(`No data received for ${type}`);
      }

      const responseData = Array.isArray(response.data) ? response.data : response.data.data;

      if (!responseData || !Array.isArray(responseData)) {
        throw new Error(`Invalid data format for ${type}`);
      }

      const formattedData = responseData.map(item => ({
        id: item.id,
        name: item.title || item.name,
        description: item.description || item.title || item.name,
        price: parseFloat(item.price) || 0,
        type: item.serviceType || item.type,
        images: item.imageUrl ? [item.imageUrl] : (item.images || []),
        location: item.location || '',
        amenities: item.amenities || {},
        availability: item.availability || {}
      }));

      console.log(`Formatted ${type} data:`, formattedData);

      switch(type) {
        case 'space':
          setVenues(formattedData);
          break;
        case 'services':
          setServices(formattedData);
          break;
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        stack: err.stack
      });
      
      let errorMessage = `Failed to fetch ${type}. `;
      if (err.code === 'ERR_NETWORK') {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (err.response?.status === 404) {
        errorMessage += 'No data available.';
      } else if (err.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += err.response?.data?.message || err.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Retry functionality with exponential backoff
  const retryWithDelay = async (type) => {
    setError(null);
    const maxRetries = 3;
    let retryCount = 0;
    
    const attemptFetch = async () => {
      try {
        await fetchData(type);
      } catch (err) {
        retryCount++;
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Retrying ${type} fetch in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptFetch();
        }
        throw err;
      }
    };

    await attemptFetch();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (activeTab) {
        await fetchData(activeTab);
      }
    };
    fetchInitialData();
  }, [activeTab]);

  const getCurrentData = () => {
    switch(activeTab) {
      case 'space':
        return venues;
      case 'services':
        return services;
      default:
        return [];
    }
  };

  const isItemSelected = (item) => {
    switch(activeTab) {
      case 'space':
        return selectedItems.venue?.id === item.id;
      case 'services':
        return selectedItems.services.some(s => s.id === item.id);
      default:
        return false;
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      switch(activeTab) {
        case 'space':
          return { ...prev, venue: prev.venue?.id === item.id ? null : item };
        case 'services':
          return {
            ...prev,
            services: prev.services.some(s => s.id === item.id)
              ? prev.services.filter(s => s.id !== item.id)
              : [...prev.services, item]
          };
        default:
          return prev;
      }
    });
  };

  const renderCard = (item) => {
    const isSelected = isItemSelected(item);
    const imageUrl = item.images && item.images.length > 0 
      ? item.images[0] 
      : 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity 
        key={item.id}
        style={[styles.card, isSelected && styles.selectedCard]} 
        onPress={() => handleSelectItem(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Feather name="check" size={16} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          {item.location ? (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
            </View>
          ) : null}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{item.price} DT</Text>
            <TouchableOpacity 
              style={[styles.selectButton, isSelected && styles.selectedButton]}
              onPress={() => handleSelectItem(item)}
            >
              <Text style={styles.selectButtonText}>
                {isSelected ? 'Selected' : 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8D8FF3" />
          <Text style={styles.loadingText}>Loading {activeTab}...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => retryWithDelay(activeTab)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const data = getCurrentData();
    
    if (data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={70} color="#8D8FF3" />
          <Text style={styles.emptyText}>No {activeTab} available</Text>
          <Text style={styles.emptySubText}>Try again later or continue without {activeTab}</Text>
        </View>
      );
    }

    return (
      <View style={styles.cardsContainer}>
        {data.map(item => renderCard(item))}
      </View>
    );
  };

  const handleDone = async () => {
    try {
      setLoading(true);
      
      // Get the current user from Firebase Auth
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setAlertConfig({
          title: 'Authentication Required',
          message: 'You must be logged in to create an event. Please sign in to continue.',
          type: 'error'
        });
        setAlertVisible(true);
        navigation.navigate('Auth');
        return;
      }

      // Validate required fields from route params
      if (!route.params?.eventName || !route.params?.date) {
        setAlertConfig({
          title: 'Required Information Missing',
          message: 'Event name and date are required to create an event.',
          type: 'error'
        });
        setAlertVisible(true);
        return;
      }

      // First, ensure the user exists in our database
      let dbUser;
      try {
        // Try to get the user first
        console.log('Fetching user with Firebase UID:', currentUser.uid);
        const userResponse = await api.get(`/users/firebase/${currentUser.uid}`);
        console.log('User response:', userResponse.data);
        // Access the nested data property
        dbUser = userResponse.data.data;
      } catch (error) {
        console.error('Error getting user:', error.response?.data || error.message);
        // If user doesn't exist, create them
        try {
          console.log('Creating new user with Firebase UID:', currentUser.uid);
          const createResponse = await api.post('/users/firebase', {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email.split('@')[0]
          });
          console.log('Create user response:', createResponse.data);
          // Access the nested data property
          dbUser = createResponse.data.data;
        } catch (createError) {
          console.error('Error creating user:', createError.response?.data || createError.message);
          // If we can't create the user, try to proceed with the Firebase UID
          console.log('Falling back to Firebase UID');
          dbUser = { id: currentUser.uid };
        }
      }

      // Ensure we have a valid user ID
      if (!dbUser || !dbUser.id) {
        console.error('No valid user ID found:', { dbUser, currentUser });
        Alert.alert('Error', 'Could not verify user account. Please try logging out and back in.');
        return;
      }

      console.log('Using user ID for event creation:', dbUser.id);

      const eventData = {
        name: route.params.eventName,
        type: route.params.eventType || 'social',
        date: route.params.date,
        created_by: dbUser.id,
        location: selectedItems.venue?.location || '',
        coverImage: selectedItems.venue?.images?.[0] || null,
        venue: selectedItems.venue ? {
          name: selectedItems.venue.name,
          price: parseFloat(selectedItems.venue.price),
          location: selectedItems.venue.location
        } : null,
        services: selectedItems.services.map(s => ({
          id: s.id,
          name: s.name,
          price: parseFloat(s.price)
        }))
      };

      console.log('Sending event data:', eventData);
      const response = await api.post('/events', eventData);

      if (response.data.success) {
        setAlertConfig({
          title: 'Success',
          message: 'Your event has been created successfully!',
          type: 'success'
        });
        setAlertVisible(true);
        navigation.navigate('Schedule', {
          refresh: true,
          newEvent: response.data.data,
          selectedDate: route.params.date
        });
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      setAlertConfig({
        title: 'Error',
        message: error.response?.data?.message || error.message || 'Failed to create event. Please try again.',
        type: 'error'
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedSummary = () => {
    const venue = selectedItems.venue ? 1 : 0;
    const services = selectedItems.services.length;
    
    if (venue === 0 && services === 0) {
      return 'No items selected';
    }
    
    const parts = [];
    if (venue > 0) parts.push(`${venue} venue`);
    if (services > 0) parts.push(`${services} service${services > 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Event</Text>
        <Text style={styles.headerSubtitle}>
          {route.params?.eventName || 'New Event'} • {route.params?.date ? new Date(route.params.date).toLocaleDateString() : 'No date'}
        </Text>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <LinearGradient
          colors={['#F5F7FF', '#FFFFFF']}
          style={styles.tabsGradient}
        >
          <View style={styles.tabs}>
            <TouchableOpacity 
              onPress={() => setActiveTab('space')} 
              style={[styles.tabButton, activeTab === 'space' && styles.activeTab]}
            >
              <Ionicons 
                name={activeTab === 'space' ? "business" : "business-outline"} 
                size={20} 
                color={activeTab === 'space' ? "#FFFFFF" : "#7C7C7C"} 
              />
              <Text style={activeTab === 'space' ? styles.activeTabText : styles.tabText}>
                Event Space
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('services')} 
              style={[styles.tabButton, activeTab === 'services' && styles.activeTab]}
            >
              <Ionicons 
                name={activeTab === 'services' ? "restaurant" : "restaurant-outline"} 
                size={20} 
                color={activeTab === 'services' ? "#FFFFFF" : "#7C7C7C"} 
              />
              <Text style={activeTab === 'services' ? styles.activeTabText : styles.tabText}>
                Services
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {/* Bottom Bar with Summary */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Selected:</Text>
          <Text style={styles.summaryText}>{getSelectedSummary()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={handleDone}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.doneButtonText}>Done</Text>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.doneButtonIcon} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        close={() => setAlertVisible(false)}
        buttons={[
          {
            text: 'OK',
            onPress: () => {
              setAlertVisible(false);
              if (alertConfig.type === 'success') {
                // Additional navigation or cleanup if needed
              }
            },
            style: alertConfig.type === 'success' ? 'success' : 'primary'
          }
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F7FF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabsContainer: {
    backgroundColor: '#F5F7FF',
  },
  tabsGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 5,
    shadowColor: '#8D8FF3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#8D8FF3',
  },
  tabText: {
    color: '#7C7C7C',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#8D8FF3',
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#8D8FF3',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  selectButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  selectedButton: {
    backgroundColor: '#E0E7FF',
  },
  selectButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8D8FF3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#8D8FF3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  doneButton: {
    backgroundColor: '#8D8FF3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  doneButtonIcon: {
    marginLeft: 4,
  },
});