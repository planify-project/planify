import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AgentModal from '../components/AgentModal';

// Add axios configuration at the top of the file
const api = axios.create({
  baseURL: 'http://172.20.10.3:3000/api',
  timeout: 10000, // Increase timeout to 10 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

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
      
      console.log(`Fetching ${type}...`);
      const response = await api.get(`/services?type=${type}`);
      
      if (response.data.success) {
        switch(type) {
          case 'venue':
            setVenues(response.data.data || []);
            break;
          case 'service':
            setServices(response.data.data || []);
            break;
          case 'equipment':
            setEquipment(response.data.data || []);
            break;
        }
      } else {
        setError(`Failed to fetch ${type} data`);
      }
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      let errorMessage = 'Network error occurred';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (err.response) {
        errorMessage = err.response.data?.message || `Error: ${err.response.status}`;
      }
      
      setError(errorMessage);
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
      setError(null);

      const eventData = {
        title: route.params?.eventName || 'New Event',
        type: route.params?.eventType || 'social',
        date: route.params?.eventDate || new Date().toISOString(),
        venue: selectedItems.venue,
        budget: parseFloat(selectedItems.venue.price || 0)
      };

      console.log('Creating event with data:', eventData);

      // Update the endpoint to match your server route
      const response = await api.post('/events', eventData);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Event created successfully!',
          [{ 
            text: 'OK', 
            onPress: () => navigation.navigate('HomeMain') 
          }]
        );
      }
    } catch (err) {
      console.error('Error creating event:', err.response?.data || err);
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
            <Text style={styles.eventType}>Birthday</Text>
            <Ionicons name="pencil" size={16} color="#007bff" style={{ marginHorizontal: 4 }} />
            <Text style={styles.date}>2 June</Text>
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
    backgroundColor: '#f6f8ff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventType: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#333',
  },
  contactButton: {
    backgroundColor: '#e6ecff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#dee3f0',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#495057',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center'
  },
  selectedRow: {
    backgroundColor: '#f0f9ff'
  },
  cell: {
    padding: 8,
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 14,
    color: '#333'
  },
  selectButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center'
  },
  selectedButton: {
    backgroundColor: '#4CAF50'
  },
  selectButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600'
  },
  selectedButtonText: {
    color: '#fff'
  },
  doneButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  }
});
