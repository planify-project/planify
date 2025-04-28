import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventCard({ image, title, location, price, rating, per, horizontal }) {
  return (
    <TouchableOpacity style={[styles.card, horizontal && styles.horizontal]}>
      <Image source={{ uri: image }} style={[styles.image, horizontal && styles.horizontalImage]} />
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{title}</Text>
          <Ionicons name="heart-outline" size={20} color="red" />
        </View>
        <Text style={styles.location}>{location}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{price}<Text style={styles.per}>/{per}</Text></Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginRight: 16, width: 220 },
  horizontal: { flexDirection: 'row', width: '100%', marginVertical: 10 },
  image: { width: '100%', height: 120 },
  horizontalImage: { width: 100, height: 100 },
  info: { padding: 8, flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  location: { fontSize: 12, color: 'gray', marginVertical: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#5D5FEE' },
  per: { fontSize: 12, color: 'gray' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 12, marginLeft: 4 },
});
