import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AgentModal from '../components/AgentModal';
import { API_BASE } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// Update the axios configuration at the top of the file
const api = axios.create({
  baseURL: process.env.API_BASE || 'http://192.168.70.126:3000/api', // Use environment variable for base URL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
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
      url: error.config?.url
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
  // Remove equipment from state
  const [activeTab, setActiveTab] = useState('space');
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  // Remove equipment state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentModalVisible, setAgentModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    venue: null,
    services: [],
    // Remove equipment from selectedItems
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
        // Remove equipment case
        default:
          throw new Error('Invalid type');
      }

      const url = serviceType ? `${endpoint}?serviceType=${serviceType}` : endpoint;
      console.log(`Fetching ${type} data from: ${API_BASE}${url}`);
      
      const response = await api.get(url, {
        timeout: 10000,
        retries: 3,
        retryDelay: 1000
      });
      const responseData = Array.isArray(response.data) ? response.data : response.data.data;

      if (responseData) {
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
          // Remove equipment case
        }
      } else {
        console.error(`No data received for ${type}`);
        setError(`No ${type} available. Please try again later.`);
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, {
        message: err.message,
        code: err.code,
        response: err.response?.data
      });
      setError(`Failed to fetch ${type}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Add retry functionality with delay
  const retryWithDelay = async (type) => {
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
    fetchData(type);
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
      // Remove equipment case
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
      // Remove equipment case
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
        // Remove equipment case
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
    if (!selectedItems.venue) {
      Alert.alert('Error', 'Please select a venue first');
      return;
    }

    try {
      setLoading(true);
      const eventData = {
        name: route.params?.eventName || 'New Event',
        type: route.params?.eventType || 'social',
        date: route.params?.date || new Date().toISOString(),
        venue: {
          name: selectedItems.venue.name,
          price: parseFloat(selectedItems.venue.price),
          location: selectedItems.venue.location
        },
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
          selectedDate: route.params?.date
        });
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create event. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AgentModal 
        visible={agentModalVisible}
        onClose={() => setAgentModalVisible(false)}
        onChooseAgent={() => {
          setAgentModalVisible(false);
        }}
      />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={styles.subHeader}>
            <Text style={styles.eventType}>{route.params?.eventType || 'Event Type'}</Text>
            <Ionicons name="pencil" size={16} color="#007bff" style={{ marginHorizontal: 4 }} />
            <Text style={styles.date}>{route.params?.eventDate || 'Event Date'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => setAgentModalVisible(true)}
        >
          <Text style={styles.contactButtonText}>Contact Agent</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          onPress={() => setActiveTab('space')} 
          style={[styles.tabButton, activeTab === 'space' && styles.activeTab]}
        >
          <Text style={activeTab === 'space' ? styles.activeTabText : styles.tabText}>Event space</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('services')} 
          style={[styles.tabButton, activeTab === 'services' && styles.activeTab]}
        >
          <Text style={activeTab === 'services' ? styles.activeTabText : styles.tabText}>Services</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderTableHeader()}
        {renderContent()}
      </ScrollView>

      {/* Done Button */}
      <TouchableOpacity 
        style={[
          styles.doneButton,
          (!selectedItems.venue && activeTab === 'space') && styles.disabledButton
        ]}
        onPress={handleDone}
        disabled={!selectedItems.venue && activeTab === 'space'}
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
  header: {
    height: 60,
    backgroundColor: '#5D5FEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  eventType: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  contactButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
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
    backgroundColor: '#5D5FEE'
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
    backgroundColor: '#5D5FEE',
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
    backgroundColor: '#5D5FEE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  disabledButton: {
    backgroundColor: '#B8B8B8'
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
    backgroundColor: '#5D5FEE',
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
});