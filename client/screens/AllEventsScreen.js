import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import EventCard from '../components/EventCard';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Responsive scaling
const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const DUMMY_EVENTS = [
  {
    id: 1,
    title: 'Pool party',
    location: 'Les grottes, Bizerte',
    price: '20 DT',
    rating: '5.0',
    per: 'person',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
  },
  {
    id: 2,
    title: 'Golden Palace',
    location: 'Cite Hasan, Nabeul',
    price: '175 DT',
    rating: '4.5',
    per: 'night',
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02c5'
  },
  {
    id: 3,
    title: 'Beach outing',
    location: 'Coco beach Ghar El Milh, Bizerte',
    price: '80 DT',
    rating: '5.0',
    per: 'person',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  }
];

export default function AllEventsScreen() {
  const navigation = useNavigation();

  const handleEventPress = (event) => {
    navigation.navigate('EventDetail', { event });
  };

  return (
    <View style={styles.container}>
   
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explore Events</Text>
      </View>

      {/* Events List */}
      <ScrollView style={styles.eventsContainer}>
        {DUMMY_EVENTS.map((event) => (
          <View key={event.id} style={styles.eventCardContainer}>
            <EventCard
              image={event.image}
              title={event.title}
              location={event.location}
              price={event.price}
              rating={event.rating}
              per={event.per}
              horizontal={true}
              onPress={() => handleEventPress(event)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F6F7FB',
  },
  headerBtn: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  titleContainer: {
    padding: 16,
    backgroundColor: '#F6F7FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventCardContainer: {
    marginBottom: 16,
  },
}); 