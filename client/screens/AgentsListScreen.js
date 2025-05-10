import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import AgentCard from '../components/AgentCard';

const { width } = Dimensions.get('window');
function normalize(size) {
  const scale = width / 375;
  return Math.round(scale * size);
}

const Agents = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    avatar: '', // Add avatar URL if available
    online: true,
    rating: 4.8,
    tags: ['Weddings', 'Corporate Events', 'Galas']
  },
  {
    id: 2,
    name: 'James Wilson',
    avatar: '',
    online: false,
    rating: 4.9,
    tags: ['Birthday Parties', 'Baby Showers', 'Anniversaries']
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    avatar: '',
    online: true,
    rating: 4.7,
    tags: ['Corporate Events', 'Product Launches', 'Conferences']
  },
  {
    id: 4,
    name: 'Michael Chang',
    avatar: '',
    online: false,
    rating: 5.0,
    tags: ['Luxury Weddings', 'Celebrity Events', 'Private Parties']
  },
  {
    id: 5,
    name: 'Rachel Foster',
    avatar: '',
    online: true,
    rating: 4.6,
    tags: ['Birthday Parties', 'Holiday Events', 'Social Gatherings']
  }
];

export default function AgentsListScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Our Event Planning Agents</Text>
      <FlatList
        data={Agents}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: normalize(16) }}
        renderItem={({ item }) => <AgentCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E9ECF8',
    paddingTop: normalize(32)
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginHorizontal: normalize(24),
    marginBottom: normalize(12),
    color: '#222'
  }
});