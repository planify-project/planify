import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AgentModal from '../components/AgentModal';

// Update the axios configuration
const api = axios.create({
  baseURL: 'http://192.168.1.60:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

export default function CreateEventScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('space');
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentModalVisible, setAgentModalVisible] = useState(false);
  // Add selected items state
  const [selectedItems, setSelectedItems] = useState({
    venue: null,
    services: [],
    equipment: []
  });

  const fetchData = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching ${type} data from: ${api.defaults.baseURL}/services?type=${type}`);
      const response = await api.get(`/services?type=${type}`);
      
      if (response.data.success) {
        switch(type) {
          case 'venue':
            setVenues(response.data.data);
            break;
          case 'service':
            setServices(response.data.data);
            break;
          case 'equipment':
            setEquipment(response.data.data);
            break;
        }
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
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
    let type;
    switch(activeTab) {
      case 'space':
        type = 'venue';
        break;
      case 'services':
        type = 'service';
        break;
      case 'equipment':
        type = 'equipment';
        break;
    }
    fetchData(type);
  }, [activeTab]);

  const getCurrentData = () => {
    switch(activeTab) {
      case 'space':
        return venues;
      case 'services':
        return services;
      case 'equipment':
        return equipment;
      default:
        return [];
    }
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { flex: 2 }]}>Name</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Price</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Action</Text>
    </View>
  );

  const renderTableRow = (item) => {
    const isSelected = isItemSelected(item);
    
    return (
      <TouchableOpacity 
        style={[styles.tableRow, isSelected && styles.selectedRow]} 
        onPress={() => handleSelectItem(item)}
      >
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.cellText}>{item.description}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.cellText}>${item.price}</Text>
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
      case 'equipment':
        return selectedItems.equipment.some(e => e.id === item.id);
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
        case 'equipment':
          return {
            ...prev,
            equipment: prev.equipment.some(e => e.id === item.id)
              ? prev.equipment.filter(e => e.id !== item.id)
              : [...prev.equipment, item]
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
            onPress={() => retryWithDelay(activeTab === 'space' ? 'venue' : activeTab === 'services' ? 'service' : 'equipment')}
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
      setError('Please select a venue first');
      return;
    }

    try {
      setLoading(true);
      const eventData = {
        name: route.params?.eventName || 'New Event',
        type: route.params?.eventType || 'social',
        date: route.params?.eventDate || new Date().toISOString(),
        location: selectedItems.venue?.description,
        budget: parseFloat(selectedItems.venue?.price || 0),
        status: 'pending',
        is_self_planned: true,
        visibility: 'public'
      };

      const response = await api.post('/events', eventData);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Event created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Schedule', { // Changed from 'ScheduleMain' to 'Schedule'
                newEvent: response.data.data,
                refresh: true
              })
            }
          ]
        );
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
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
        <TouchableOpacity onPress={() => setActiveTab('space')} style={[styles.tabButton, activeTab === 'space' && styles.activeTab]}>
          <Text style={activeTab === 'space' ? styles.activeTabText : styles.tabText}>Event space</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('services')} style={[styles.tabButton, activeTab === 'services' && styles.activeTab]}>
          <Text style={activeTab === 'services' ? styles.activeTabText : styles.tabText}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('equipment')} style={[styles.tabButton, activeTab === 'equipment' && styles.activeTab]}>
          <Text style={activeTab === 'equipment' ? styles.activeTabText : styles.tabText}>Equipment</Text>
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
  }
});
