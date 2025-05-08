import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const API_ENDPOINT = `${API_BASE}/events/public`;

export default function AllEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = ['All', 'Wedding', 'Birthday', 'Concert'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchEventsByCategory = async (category) => {
    setLoading(true);
    setSelectedCategory(category);
  
    let url = `${API_ENDPOINT}`;
    if (category !== 'All') {
      url += `?type=${category}`;
      // url += `?type=${encodeURIComponent(category)}`;
    }
  
    try {
      // const response = await axios.get(`http://192.168.73.232:3000/api/events/public?type=Wedding`);
      const response = await axios.get(url);
      console.log("❤️❤️❤️",selectedCategory,response.data);
      
      setEvents(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error filtering events:", err.message);
      setError("Could not load events");
    }
  };

  useEffect(() => {
    fetchEventsByCategory('All');
  }, []);

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
    <Image source={{ uri: item.coverImage }} style={styles.image} />
    <View style={styles.cardContent}>
      <View style={styles.tagContainer}>
        <Text style={styles.tag}>{item.type || 'Public'}</Text>
      </View>
      <Text style={styles.title}>{item.name}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="star" size={16} color="#FFD700" />
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
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D5FEE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerTitleButton}>
          <Text style={styles.headerTitleButtonText}>All Events</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => fetchEventsByCategory(cat)}
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
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: normalize(16),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(12),
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#E6ECFF',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(8),
    marginRight: normalize(8),
    marginBottom: normalize(8),
  },
  filterButtonActive: {
    backgroundColor: '#5D5FEE',
  },
  filterText: {
    color: '#5D5FEE',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: normalize(20),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    overflow: 'hidden',
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 2,
  },
  image: {
    width: '100%',
    height: normalize(180),
    borderTopLeftRadius: normalize(12),
    borderTopRightRadius: normalize(12),
  },
  cardContent: {
    padding: normalize(12),
  },
  tagContainer: {
    position: 'absolute',
    top: normalize(12),
    left: normalize(12),
    backgroundColor: '#5D5FEE',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
  },
  tag: {
    color: '#fff',
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  title: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#222',
    marginBottom: normalize(8),
    textAlign: 'right',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  rating: {
    fontSize: normalize(14),
    color: '#222',
    marginLeft: normalize(4),
    marginRight: normalize(8),
  },
  attendees: {
    fontSize: normalize(14),
    color: '#666',
  },
  location: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: normalize(8),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#5D5FEE',
  },
  detailsButton: {
    backgroundColor: '#E6ECFF',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(12),
  },
  detailsButtonText: {
    color: '#5D5FEE',
    fontSize: normalize(14),
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
    color: 'red',
    fontSize: normalize(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(16),
    padding: normalize(12),
    backgroundColor: '#F6F7FB',
  },
  headerButton: {
    width: normalize(40),
    height: normalize(40),
    backgroundColor: '#E6ECFF',
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 2,
  },
  headerTitleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6ECFF',
    borderRadius: normalize(8),
    paddingVertical: normalize(8),
    marginHorizontal: normalize(8),
  },
  headerTitleButtonText: {
    color: '#5D5FEE',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});