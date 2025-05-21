import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- Add this import

const { width } = Dimensions.get('window');
function normalize(size) {
  const scale = width / 375;
  return Math.round(scale * size);
}

const AGENT = {
  name: 'Sarah Mitchell',
  avatar: '', // Add real URL if available
  online: true,
  rating: 4.8,
  reviews: 124,
  tags: ['Weddings', 'Corporate Events', 'Luxury Gatherings'],
  description: 'Professional event planner with over 8 years of experience specializing in luxury weddings and corporate events. Known for attention to detail and creating unforgettable experiences.',
};

const PREVIOUS_EVENTS = [
  {
    id: 1,
    title: 'Beach Wedding',
    image: 'https://via.placeholder.com/400x250.png?text=400+x+250',
  },
  {
    id: 2,
    title: 'Corporate Gala',
    image: 'https://via.placeholder.com/400x250.png?text=400+x+250',
  },
];

const REVIEWS = [
  {
    id: 1,
    name: 'Jennifer P.',
    avatar: '',
    rating: 5,
    time: '2 weeks ago',
    text: 'Sarah was absolutely amazing! She made our wedding day perfect in every way.',
  },
  {
    id: 2,
    name: 'Michael R.',
    avatar: '',
    rating: 5,
    time: '1 month ago',
    text: 'Great attention to detail and very professional throughout our corporate event planning.',
  },
  {
    id: 3,
    name: 'Emma L.',
    avatar: '',
    rating: 5,
    time: '6 months ago',
    text: 'Exceeded all expectations. The gala she organized was talked about for weeks!',
  },
];

const AVATAR_PLACEHOLDER = 'https://via.placeholder.com/120x120.png?text=120+x+120';
const REVIEW_AVATAR_PLACEHOLDER = 'https://via.placeholder.com/40x40.png?text=👤';

export default function AgentProfileScreen() {
  const navigation = useNavigation(); // <-- Add this line

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Agent Card */}
      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginBottom: normalize(12) }}>
          <Image
            source={{ uri: AGENT.avatar || AVATAR_PLACEHOLDER }}
            style={styles.avatar}
          />
          <View style={styles.onlineDot} />
        </View>
        <Text style={styles.name}>{AGENT.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(4) }}>
          <Text style={styles.stars}>★</Text>
          <Text style={styles.rating}>{AGENT.rating}</Text>
          <Text style={styles.reviewCount}>({AGENT.reviews} reviews)</Text>
          <Text style={[styles.online, { marginLeft: normalize(8) }]}>{AGENT.online ? 'Online' : 'Offline'}</Text>
        </View>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => navigation.navigate('Agent Chat')} // <-- Add this handler
        >
          <Text style={styles.contactBtnText}>Contact Agent</Text>
        </TouchableOpacity>
        <View style={styles.tagsRow}>
          {AGENT.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.description}>{AGENT.description}</Text>
      </View>

      {/* Previous Events */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>Previous Events</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All Events</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={PREVIOUS_EVENTS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        style={{ marginBottom: normalize(16) }}
        contentContainerStyle={{ paddingLeft: normalize(16) }}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{item.title}</Text>
          </View>
        )}
      />

      {/* Client Reviews */}
      <Text style={styles.sectionHeader}>Client Reviews</Text>
      {REVIEWS.map(review => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) }}>
            <Image
              source={{ uri: review.avatar || REVIEW_AVATAR_PLACEHOLDER }}
              style={styles.reviewAvatar}
            />
            <View style={{ marginLeft: normalize(8) }}>
              <Text style={styles.reviewName}>{review.name}</Text>
              <Text style={styles.reviewTime}>{review.time}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) }}>
            <Text style={styles.stars}>★</Text>
            <Text style={styles.rating}>{review.rating}</Text>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.viewAllBtn}>
        <Text style={styles.viewAllBtnText}>View All Reviews</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: normalize(16),
    padding: normalize(16),
    margin: normalize(16),
    marginBottom: normalize(12),
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: normalize(8),
    shadowOffset: { width: 0, height: normalize(2) },
    elevation: 2,
    alignItems: 'center'
  },
  avatar: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: '#eee',
    marginBottom: normalize(8)
  },
  onlineDot: {
    position: 'absolute',
    bottom: normalize(12),
    right: normalize(12),
    width: normalize(16),
    height: normalize(16),
    borderRadius: normalize(8),
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff'
  },
  name: {
    fontWeight: 'bold',
    fontSize: normalize(20),
    color: '#222',
    textAlign: 'center'
  },
  stars: {
    color: '#FFC107',
    fontSize: normalize(16),
    marginRight: normalize(2)
  },
  rating: {
    fontSize: normalize(15),
    color: '#222',
    fontWeight: '500'
  },
  reviewCount: {
    fontSize: normalize(13),
    color: '#888',
    marginLeft: normalize(4)
  },
  online: {
    fontSize: normalize(13),
    color: '#22C55E',
    fontWeight: '500'
  },
  contactBtn: {
    backgroundColor: '#8d8ff3',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(8),
    marginTop: normalize(12),
    marginBottom: normalize(8)
  },
  contactBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(15)
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(8),
    marginBottom: normalize(8),
    justifyContent: 'center'
  },
  tag: {
    backgroundColor: '#F4F6FC',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    marginRight: normalize(8),
    marginBottom: normalize(6)
  },
  tagText: {
    fontSize: normalize(13),
    color: '#444'
  },
  description: {
    fontSize: normalize(14),
    color: '#444',
    marginTop: normalize(8),
    textAlign: 'center'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginTop: normalize(16),
    marginBottom: normalize(8)
  },
  sectionHeader: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#222'
  },
  seeAll: {
    fontSize: normalize(13),
    color: '#8d8ff3',
    fontWeight: '500'
  },
  eventCard: {
    width: normalize(160),
    marginRight: normalize(12),
    borderRadius: normalize(12),
    overflow: 'hidden',
    backgroundColor: '#eee'
  },
  eventImage: {
    width: '100%',
    height: normalize(100),
    backgroundColor: '#ccc'
  },
  eventTitle: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#222',
    padding: normalize(8),
    paddingBottom: normalize(10)
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    padding: normalize(12),
    marginHorizontal: normalize(16),
    marginBottom: normalize(12),
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: normalize(4),
    shadowOffset: { width: 0, height: normalize(1) },
    elevation: 1
  },
  reviewAvatar: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: '#eee'
  },
  reviewName: {
    fontWeight: 'bold',
    fontSize: normalize(14),
    color: '#222'
  },
  reviewTime: {
    fontSize: normalize(12),
    color: '#888'
  },
  reviewText: {
    fontSize: normalize(14),
    color: '#444',
    marginTop: normalize(4)
  },
  viewAllBtn: {
    backgroundColor: '#F4F6FC',
    borderRadius: normalize(8),
    paddingVertical: normalize(10),
    marginHorizontal: normalize(16),
    marginTop: normalize(4),
    alignItems: 'center'
  },
  viewAllBtnText: {
    color: '#4f78f1',
    fontWeight: 'bold',
    fontSize: normalize(15)
  }
});