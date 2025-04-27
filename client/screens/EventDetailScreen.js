import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';

const event = {
  title: 'Pool party',
  price: '20 DT/person',
  location: 'Les grottes, Bizerte',
  description:
    'Pool party, Les grottes, Bizerte is a wonderful, elegant 5 star hotel overlooking the sea, perfect for a romantic, charming',
  images: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  ],
  mainImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  rating: 5.0,
  features: [
    { icon: '📶', label: 'Free Wifi' },
    { icon: '🍳', label: 'Free Breakfast' },
  ],
};

const { width } = Dimensions.get('window');

export default function EventDetailScreen(props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    console.log('EventDetailScreen rendered', props.route?.params);
  }, [props.route]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.mainImage }} style={styles.mainImage} />
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Text style={{ fontSize: 22 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          {event.features.map((f, idx) => (
            <View key={idx} style={styles.featureTag}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.label}</Text>
            </View>
          ))}
          <View style={styles.featureTag}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureText}>{event.rating}</Text>
          </View>
        </View>

        {/* Title, Price, Location */}
        <View style={styles.infoRow}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventPrice}>{event.price}</Text>
        </View>
        <View style={styles.locationRow}>
          <Text style={styles.locationDot}>•</Text>
          <Text style={styles.locationText}>{event.location}</Text>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {showFullDesc ? event.description : event.description.slice(0, 80) + '...'}
          {!showFullDesc && (
            <Text style={styles.readMore} onPress={() => setShowFullDesc(true)}>
              {' Read More...'}
            </Text>
          )}
        </Text>

        {/* Preview Images */}
        <Text style={styles.sectionTitle}>Preview</Text>
        <FlatList
          data={event.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, idx) => idx.toString()}
          style={{ marginBottom: 20 }}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.previewImage} />
          )}
        />
      </ScrollView>

      {/* Join Event Button */}
      <TouchableOpacity style={styles.joinBtn}>
        <Text style={styles.joinBtnText}>Join Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  headerBtn: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 22,
    color: '#222',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  mainImage: {
    width: width - 32,
    height: 180,
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
  readMore: {
    color: '#2D9CDB',
    fontWeight: '500',
  },
  previewImage: {
    width: 90,
    height: 60,
    borderRadius: 10,
    marginHorizontal: 6,
    backgroundColor: '#eee',
  },
  joinBtn: {
    backgroundColor: '#4F7CAC',
    margin: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 