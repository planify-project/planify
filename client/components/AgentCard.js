import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
function normalize(size) {
  const scale = width / 375;
  return Math.round(scale * size);
}

const AVATAR_PLACEHOLDER = 'https://via.placeholder.com/48x48.png?text=👤';

export default function AgentCard({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('AgentProfile', { agent: item })}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: item.avatar || AVATAR_PLACEHOLDER }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: normalize(12), flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={[styles.status, { color: item.online ? '#22C55E' : '#888', marginLeft: normalize(6) }]}>
                {item.online ? 'Online' : 'Offline'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(2) }}>
              <Text style={styles.stars}>★</Text>
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tagsRow}>
          {item.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(18),
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: normalize(8),
    shadowOffset: { width: 0, height: normalize(2) },
    elevation: 2
  },
  avatar: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: '#eee'
  },
  name: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    color: '#222'
  },
  status: {
    fontSize: normalize(13),
    fontWeight: '500'
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(10)
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
  }
});