import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const sampleFeatures = [
  { icon: '📶', label: 'Free Wifi' },
  { icon: '🍳', label: 'Free Breakfast' },
  { icon: '⭐', label: '5.0' },
];

export default function EventCard({ event }) {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
      activeOpacity={0.93}
    >
      {/* Image with favorite button overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Text style={{ fontSize: 22 }}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      {/* Features row */}
      <View style={styles.featuresRow}>
        {sampleFeatures.map((f, idx) => (
          <View key={idx} style={styles.featureTag}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.label}</Text>
          </View>
        ))}
      </View>
      {/* Title, Price, Location */}
      <View style={styles.infoRow}>
        <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.eventPrice}>{event.is_free ? 'Free' : `$${event.price}`}</Text>
      </View>
      <View style={styles.locationRow}>
        <Text style={styles.locationDot}>•</Text>
        <Text style={styles.locationText} numberOfLines={1}>{event.location}</Text>
      </View>
      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>
      {/* Join Event Button */}
      <TouchableOpacity style={styles.joinBtn} onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}>
        <Text style={styles.joinBtnText}>Join Event</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F6F7FB',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
    paddingBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    margin: 12,
    marginBottom: 0,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  eventPrice: {
    fontSize: 15,
    color: '#2D9CDB',
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  locationDot: {
    fontSize: 18,
    color: '#2D9CDB',
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  joinBtn: {
    backgroundColor: '#4F7CAC',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 