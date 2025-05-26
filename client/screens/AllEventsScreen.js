import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Dimensions, ActivityIndicator, TextInput,
  Modal, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import { debounce } from 'lodash';
import EventCard from '../components/EventCard';
import DateTimePicker from '@react-native-community/datetimepicker';

// Responsive scaling
const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const API_ENDPOINT = `${API_BASE}/events/search`;

export default function AllEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchEvents = async (query = '', date = '') => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.append('name', query.trim());
      }
      if (date) {
        params.append('date', date);
      }

      console.log('Fetching events with params:', params.toString());
      const response = await axios.get(`${API_ENDPOINT}?${params.toString()}`);
      
      if (response.data) {
        setEvents(response.data);
        setError(null);
      } else {
        setEvents([]);
        setError('No events found');
      }
    } catch (err) {
      console.error("Error searching events:", err);
      setError(err.response?.data?.error || "Could not load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      fetchEvents(text, selectedDate);
    }, 500),
    [selectedDate]
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Please enter an event name');
      return;
    }

    // Adjust the date to account for timezone
    const adjustedDate = new Date(eventDate);
    adjustedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    navigation.navigate('CreateEvent', {
      eventName: eventName.trim(),
      date: adjustedDate.toISOString(),
      eventType: 'social'
    });

    setShowCreateModal(false);
    setEventName('');
    setEventDate(new Date());
  };

  useEffect(() => {
    fetchEvents(searchQuery, selectedDate);
  }, []);

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' }} 
        style={styles.image}
        onError={(e) => {
          console.error('Image loading error:', e.nativeEvent.error);
        }}
      />
      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{item.type || 'Public'}</Text>
        </View>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Text style={styles.rating}>N/A</Text>
          <Text style={styles.attendees}>{item.attendees_count || 0} attendees</Text>
        </View>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {item.is_free ? 'Free' : `${item.ticketPrice || 'N/A'} DT`}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Create Event Button */}
      <TouchableOpacity
        style={styles.createEventButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.createEventText}>Create Event</Text>
      </TouchableOpacity>

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Event</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={eventName}
              onChangeText={setEventName}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#6C6FD1" />
              <Text style={styles.dateButtonText}>
                {eventDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setEventName('');
                  setEventDate(new Date());
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateEvent}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Bar */}
      <View style={{ marginBottom: normalize(12) }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: normalize(8),
          paddingHorizontal: normalize(10),
          paddingVertical: normalize(6),
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1
        }}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: normalize(14) }}
            placeholder="Search by name or location"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {selectedDate ? (
            <TouchableOpacity 
              onPress={() => handleDateChange(null, '')}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => {
                const today = new Date().toISOString().split('T')[0];
                handleDateChange(null, today);
              }}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="calendar" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Event List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C6FD1" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: normalize(16),
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C6FD1',
    padding: normalize(12),
    borderRadius: normalize(8),
    marginBottom: normalize(16),
    justifyContent: 'center',
  },
  createEventText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginLeft: normalize(8),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: normalize(200),
    borderTopLeftRadius: normalize(12),
    borderTopRightRadius: normalize(12),
  },
  cardContent: {
    padding: normalize(16),
  },
  tagContainer: {
    position: 'absolute',
    top: normalize(16),
    right: normalize(16),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(16),
  },
  tag: {
    color: '#fff',
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  title: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  rating: {
    marginLeft: normalize(4),
    marginRight: normalize(12),
    color: '#666',
  },
  attendees: {
    color: '#666',
  },
  location: {
    color: '#666',
    marginBottom: normalize(12),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#6C6FD1',
  },
  detailsButton: {
    backgroundColor: '#6C6FD1',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: normalize(16),
  },
  listContainer: {
    paddingBottom: normalize(16),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    padding: normalize(20),
    width: '90%',
    maxWidth: normalize(400),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: normalize(20),
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(16),
    fontSize: normalize(16),
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(20),
  },
  dateButtonText: {
    marginLeft: normalize(8),
    fontSize: normalize(16),
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: normalize(12),
  },
  modalButton: {
    flex: 1,
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#6C6FD1',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});