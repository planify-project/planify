import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import EventCard from '../components/EventCard'; // Import EventCard

const wishlistData = [
  {
    id: '1',
    title: 'Luxury Beach Resort',
    location: 'Beachside, Miami', // Added location for EventCard
    price: '$299.99',
    rating: '4.8', // Added rating for EventCard
    per: 'night', // Added per for EventCard
    image: 'https://via.placeholder.com/400x300.png?text=400+x+300',
  },
  {
    id: '2',
    title: 'Mountain Lodge Retreat',
    location: 'Mountain View, Colorado',
    price: '$249.99',
    rating: '4.7',
    per: 'night',
    image: 'https://via.placeholder.com/400x300.png?text=400+x+300',
  },
  {
    id: '3',
    title: 'City Center Hotel',
    location: 'Downtown, New York',
    price: '$189.99',
    rating: '4.5',
    per: 'night',
    image: 'https://via.placeholder.com/400x300.png?text=400+x+300',
  },
];

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function WishlistScreen() {
  const renderItem = ({ item }) => (
    <EventCard
      image={item.image}
      title={item.title}
      location={item.location}
      price={item.price}
      rating={item.rating}
      per={item.per}
      horizontal={true}
      // Optionally, add onPress or other props as needed
    />
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={wishlistData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: normalize(16), paddingTop: normalize(8) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: normalize(24),
    flex: 1,
    backgroundColor: '#F4F6FC',
  },
});
