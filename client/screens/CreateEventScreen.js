import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const venues = [
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
  },
];

export default function CreateEventScreen() {
  const [activeTab, setActiveTab] = useState('space');

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.contactButton}>
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

      {/* Venue Cards */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {venues.map(venue => (
          <View key={venue.id} style={styles.card}>
            <Image source={{ uri: venue.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <Text style={styles.price}>${venue.price}</Text>
              <Text style={styles.status}>{venue.status}</Text>
              <TouchableOpacity style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 4,
  },
  status: {
    color: '#28a745',
  },
  selectButton: {
    marginTop: 8,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
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
});
