import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import EventCard from '../components/EventCard';

const DUMMY_EVENTS = [
  {
    id: 1,
    title: 'Sample Pool Party',
    location: 'City Pool',
    date: new Date().toISOString(),
    description: 'A fun pool party for all ages!',
    is_free: false,
    price: 20,
    available_spots: 20,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
  },
  {
    id: 2,
    title: 'Sample Beach Festival',
    location: 'Sunny Beach',
    date: new Date().toISOString(),
    description: 'Enjoy music and games at the beach.',
    is_free: true,
    price: null,
    available_spots: 50,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'
  },
  {
    id: 3,
    title: 'Sample Sunset Yoga',
    location: 'Central Park',
    date: new Date().toISOString(),
    description: 'Relax and unwind with sunset yoga.',
    is_free: true,
    price: null,
    available_spots: 10,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'
  }
];

export default function AllEventsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FB' }}>
      {/* Custom Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8, backgroundColor: 'transparent' }}>
        <View style={{ width: 32 }} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222', textAlign: 'center' }}>All Events</Text>
        <TouchableOpacity style={{ padding: 8 }}>
          <Text style={{ fontSize: 22, color: '#222' }}>⋯</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={DUMMY_EVENTS}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No events found.</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
} 