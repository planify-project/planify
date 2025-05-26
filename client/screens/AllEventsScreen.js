import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Dimensions, ActivityIndicator, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import { debounce } from 'lodash';
import EventCard from '../components/EventCard';

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
  const categories = ['All', 'Wedding', 'Birthday', 'Concert'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchEvents = async (category, query = '', date = '') => {
    setLoading(true);
    setSelectedCategory(category);

    try {
      const params = new URLSearchParams();
      if (category !== 'All') {
        params.append('type', category);
      }
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
      fetchEvents(selectedCategory, text, selectedDate);
    }, 500),
    [selectedCategory, selectedDate]
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchEvents(selectedCategory, searchQuery, date);
  };

  useEffect(() => {
    fetchEvents(selectedCategory, searchQuery, selectedDate);
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
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.createEventText}>Create Event</Text>
      </TouchableOpacity>

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
              onPress={() => handleDateChange('')}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => {
                const today = new Date().toISOString().split('T')[0];
                handleDateChange(today);
              }}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="calendar" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => fetchEvents(cat, searchQuery, selectedDate)}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.filterButtonActive
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.filterTextActive
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C6FD1" />
        </View>
      ) : error ? (
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>No events found</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Slightly lighter background for modern feel
    padding: 20, // Increased padding for better spacing
  },
  searchContainer: {
    marginBottom: 20, // Increased margin
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // More modern rounded corners
    paddingHorizontal: 18,
    paddingVertical: 14, // Increased padding for better touch targets
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Subtle border
  },
  searchIcon: {
    marginRight: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827', // Darker text for better readability
    fontWeight: '500', // Medium weight for better visibility
  },
  iconButton: {
    padding: 6, // Larger touch target
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Increased gap
    marginBottom: 24, // More breathing room
  },
  filterButton: {
    backgroundColor: '#F3F4F6', // More neutral background
    paddingVertical: 10, // Taller buttons
    paddingHorizontal: 18, // Wider buttons
    borderRadius: 24, // More rounded for modern look
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#6C6FD1',
    borderColor: '#6C6FD1',
  },
  filterText: {
    color: '#4B5563', // More neutral color when inactive
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 40, // More bottom padding
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // More rounded corners for modern look
    marginBottom: 24, // More space between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, // More pronounced shadow
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 7, // Increased elevation
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200, // Taller images
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardContent: {
    padding: 20, // More padding inside card
  },
  tagContainer: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: 'rgba(108, 111, 209, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    backdropFilter: 'blur(4px)',
  },
  tag: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800', // Extra bold for emphasis
    letterSpacing: 0.7, // More spacing for readability
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14, // Larger title
    fontWeight: '700',
    color: '#111827', // Darker for better contrast
    marginBottom: 10,
    letterSpacing: 0.3,

    textAlign: 'right', // Align text to the right
    lineHeight: 26, // Better line height for readability
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B', // Amber color for ratings
    fontWeight: '700', // Bolder
    marginLeft: 6,
    marginRight: 16, // More spacing
  },
  attendees: {
    fontSize: 14,
    color: '#6B7280', // More neutral gray
    marginLeft: 6,
    fontWeight: '500', // Medium weight
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // More space before footer
  },
  location: {
    fontSize: 14,
    color: '#4B5563', // Better contrast
    marginLeft: 8,
    fontWeight: '500', // Medium weight
    flex: 1, // Allow text to wrap
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6, // Add some space at the top
    paddingTop: 16, // Add padding at the top
    borderTopWidth: 1, // Add a subtle divider
    borderTopColor: '#F3F4F6', // Light gray divider
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6C6FD1',
  },
  detailsButton: {
    backgroundColor: '#6C6FD1',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  detailsButtonText: {
    color: '#FFFFFF', // White text on colored background
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
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
    padding: 24,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24, // Better readability
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24, // Better readability
  },
  createEventButton: {
    backgroundColor: '#6C6FD1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(12),
    borderRadius: normalize(12),
    marginBottom: normalize(16),
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  createEventText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginLeft: normalize(8),
  },
});