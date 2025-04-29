import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const wishlistData = [
  {
    id: '1',
    title: 'Luxury Beach Resort',
    date: 'Aug 15-20, 2024',
    price: '$299.99',
    image: 'https://via.placeholder.com/400x300.png?text=400+x+300',
  },
  {
    id: '2',
    title: 'Mountain Lodge Retreat',
    date: 'Sep 5-10, 2024',
    price: '$249.99',
    image: 'https://via.placeholder.com/400x300.png?text=400+x+300',
  },
  {
    id: '3',
    title: 'City Center Hotel',
    date: 'Oct 12-15, 2024',
    price: '$189.99',
    image: 'https://via.placeholder.com/400x300.png?text=400+x+300',
  },
];

export default function WishlistScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#b3b3c6" />
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.price}>
          <Text style={{ color: '#5D5FEE', fontWeight: 'bold' }}>{item.price}</Text>
          <Text style={styles.night}>/night</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#b3b3c6" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={wishlistData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 24, // Add padding at the top of the screen to avoid content overlapping with the header
    flex: 1,
    backgroundColor: '#F4F6FC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#F4F6FC',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#5D5FEE',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 45,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
  },
  price: {
    fontSize: 15,
    marginTop: 2,
  },
  night: {
    color: '#b3b3c6',
    fontSize: 13,
    fontWeight: 'normal',
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
  },
});

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}
