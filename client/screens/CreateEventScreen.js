import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AgentModal from '../components/AgentModal';

const mockData = {
  spaces: [
    {
      id: 1,
      name: 'Grand Ballroom',
      price: 2007,
      status: 'Available',
      image: 'https://i.imgur.com/8z8F1L8.jpg',
    },
    {
      id: 2,
      name: 'Garden Venue',
      price: 1800,
      status: 'Available',
      image: 'https://i.imgur.com/LkY3L1x.jpg',
    }
  ],
  equipment: [
    {
      id: 1,
      name: 'Sound System',
      price: 500,
      status: 'Available'
    },
    {
      id: 2,
      name: 'Lighting Kit',
      price: 300,
      status: 'Available'
    }
  ]
};

export default function CreateEventScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('space');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentModalVisible, setAgentModalVisible] = useState(false);

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    }
  }, [activeTab]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching services...');
      // Replace localhost with your computer's IP address
      const response = await axios.get('http://192.168.1.211:3000/api/services');
      console.log('Services response:', response.data);
      setServices(response.data.data); // Note: response.data.data because of the server response structure
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(`Failed to fetch services: ${err.message}`);
    } finally {
      setLoading(false);
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

  const renderTableRow = (item) => (
    <View style={styles.tableRow} key={item.id}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>${item.price}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.status}</Text>
      <View style={[styles.cell, { flex: 1 }]}>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AgentModal 
        visible={agentModalVisible}
        onClose={() => setAgentModalVisible(false)}
        onChooseAgent={() => {
          setAgentModalVisible(false);
          // Add navigation to agent selection screen if needed
          navigation.navigate('Agent List');
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
        
        {activeTab === 'space' && (
          mockData.spaces.map(item => renderTableRow(item))
        )}
        
        {activeTab === 'services' && (
          loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading services...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            services.map(item => renderTableRow(item))
          )
        )}

        {activeTab === 'equipment' && (
          mockData.equipment.map(item => renderTableRow(item))
        )}
      </ScrollView>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton}>
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
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cell: {
    fontSize: 14,
    color: '#212529',
  },
  selectButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
