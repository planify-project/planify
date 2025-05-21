import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { normalize } from '../utils/scaling';

// Update the axios configuration at the top of the file
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for better debugging
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

// Add error handling interceptor with better logging
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

// // Example of setting an item
// const setItem = async (key, value) => {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   } catch (error) {
//     console.error('Error saving data', error);
//   }
// };

// // Example of getting an item
// const getItem = async (key) => {
//   try {
//     const value = await AsyncStorage.getItem(key);
//     return value ? JSON.parse(value) : null;
//   } catch (error) {
//     console.error('Error reading data', error);
//     return null;
//   }
// };

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

  // Add retry functionality with exponential backoff
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

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Price</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Action</Text>
    </View>
  );

  const renderTableRow = (item) => {
    const isSelected = isItemSelected(item);

    return (
      <TouchableOpacity 
        key={item.id}
        style={[styles.tableRow, isSelected && styles.selectedRow]} 
        onPress={() => handleSelectItem(item)}
      >
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.cellText}>{item.name}</Text>
          {item.location && (
            <Text style={styles.locationText}>{item.location}</Text>
          )}
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>{item.price} DT</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <View style={[styles.selectButton, isSelected && styles.selectedButton]}>
            <Text style={[styles.selectButtonText, isSelected && styles.selectedButtonText]}>
              {isSelected ? 'Selected' : 'Select'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading {activeTab}...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
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
    return data.length > 0 ? (
      data.map((item) => renderTableRow(item))
    ) : (
      <Text style={styles.noDataText}>No {activeTab} available</Text>
    );
  };

  const handleDone = async () => {
    try {
      setLoading(true);
      
      // Get the current user from Firebase Auth
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to create an event');
        navigation.navigate('Auth');
        return;
      }

      // Validate required fields from route params
      if (!route.params?.eventName || !route.params?.date) {
        Alert.alert('Error', 'Event name and date are required');
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
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to create event. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          onPress={() => setActiveTab('space')} 
          style={[styles.tabButton, activeTab === 'space' && styles.activeTab]}
        >
          <Text style={activeTab === 'space' ? styles.activeTabText : styles.tabText}>Event space (Optional)</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('services')} 
          style={[styles.tabButton, activeTab === 'services' && styles.activeTab]}
        >
          <Text style={activeTab === 'services' ? styles.activeTabText : styles.tabText}>Services (Optional)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderTableHeader()}
        {renderContent()}
      </ScrollView>

      {/* Done Button */}
      <TouchableOpacity 
        style={styles.doneButton}
        onPress={handleDone}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F8'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: '#8d8ff3'
  },
  tabText: {
    color: '#7C7C7C',
    fontSize: 15,
    fontWeight: '500'
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  scrollContainer: {
    padding: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  headerCell: {
    fontWeight: '600',
    color: '#1E1E1E',
    fontSize: 15
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  selectedRow: {
    backgroundColor: '#F0F8FF'
  },
  cell: {
    padding: 5,
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 15,
    color: '#1E1E1E'
  },
  selectButton: {
    backgroundColor: '#8d8ff3',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center'
  },
  selectedButton: {
    backgroundColor: '#4CAF50'
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  doneButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#8d8ff3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center'
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10
  },
  retryButton: {
    backgroundColor: '#8d8ff3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  noDataText: {
    textAlign: 'center',
    color: '#7C7C7C',
    marginTop: 20,
    fontSize: 16
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#8d8ff3',
    paddingVertical: normalize(16),
    borderRadius: normalize(12),
    alignItems: 'center',
    marginTop: normalize(24),
  },
  addPhotoButton: {
    backgroundColor: '#8d8ff3',
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginTop: normalize(8),
  },
  categoryButton: {
    backgroundColor: '#8d8ff3',
    padding: normalize(12),
    borderRadius: normalize(8),
    marginRight: normalize(8),
  },
  locationButton: {
    backgroundColor: '#8d8ff3',
    padding: normalize(12),
    borderRadius: normalize(8),
    marginTop: normalize(8),
  },
});