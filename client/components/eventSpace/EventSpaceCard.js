import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/scaling';
import { FontAwesome } from '@expo/vector-icons';

const EventSpaceCard = ({ space, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {space.images && space.images.length > 0 ? (
          <Image
            source={{ uri: space.images[0] }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="image" size={40} color="#ccc" />
          </View>
        )}
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{space.name}</Text>
        <View style={styles.locationContainer}>
          <FontAwesome name="map-marker" size={16} color="#666" />
          <Text style={styles.location}>{space.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <FontAwesome name="users" size={16} color="#666" />
            <Text style={styles.infoText}>Up to {space.capacity}</Text>
          </View>
          <Text style={styles.price}>{space.price} DT/day</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: normalize(200),
    borderTopLeftRadius: normalize(12),
    borderTopRightRadius: normalize(12),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    padding: normalize(16),
  },
  name: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(4),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  location: {
    marginLeft: normalize(8),
    color: '#666',
    fontSize: normalize(14),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: normalize(8),
    color: '#666',
    fontSize: normalize(14),
  },
  price: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#5D5FEE',
  },
});

export default EventSpaceCard;