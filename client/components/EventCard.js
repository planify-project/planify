import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../context/WishlistContext';

// Responsive scaling
const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function EventCard({ image, title, location, price, rating, per, horizontal, onPress, id }) {
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const handleWishlistPress = (e) => {
    e.stopPropagation();
    if (!id) {
      console.error('Invalid event ID for wishlist toggle:', id);
      return;
    }
    
    // Convert id to string to match the database schema
    const itemId = String(id);
    console.log('Toggling wishlist for event:', itemId);
    toggleWishlistItem(itemId, 'event');
  };

  return (
    <TouchableOpacity 
      style={[styles.card, horizontal && styles.horizontal]}
      onPress={onPress}
      activeOpacity={0.5}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      delayPressIn={0}
    >
      <Image source={{ uri: image }} style={[styles.image, horizontal && styles.horizontalImage]} />
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleWishlistPress}>
            <Ionicons 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={normalize(20)} 
              color={isWishlisted ? "red" : "gray"} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.location}>{location}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{price}<Text style={styles.per}>/{per}</Text></Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={normalize(14)} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    borderRadius: normalize(16), 
    overflow: 'hidden', 
    marginRight: normalize(16), 
    width: normalize(220) 
  },
  horizontal: { 
    flexDirection: 'row', 
    width: '100%', 
    marginVertical: normalize(10) 
  },
  image: { 
    width: '100%', 
    height: normalize(120) 
  },
  horizontalImage: { 
    width: normalize(100), 
    height: normalize(100) 
  },
  info: { 
    padding: normalize(8), 
    flex: 1 
  },
  title: { 
    fontSize: normalize(16), 
    fontWeight: 'bold' 
  },
  location: { 
    fontSize: normalize(12), 
    color: 'gray', 
    marginVertical: normalize(4) 
  },
  bottomRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  price: { 
    fontSize: normalize(14), 
    fontWeight: 'bold', 
    color: '#4f78f1' 
  },
  per: { 
    fontSize: normalize(12), 
    color: 'gray' 
  },
  rating: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  ratingText: { 
    fontSize: normalize(12), 
    marginLeft: normalize(4) 
  },
}); 