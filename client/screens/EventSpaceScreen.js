import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl 
} from 'react-native';
import { fetchEventSpaces } from '../configs/EventSpaceAPI';
import EventSpaceCard from '../components/eventSpace/EventSpaceCard';
import SearchBar from '../components/common/SearchBar';
import { normalize } from '../utils/scaling';

const { width } = Dimensions.get('window');

export default function EventSpaceScreen({ navigation }) {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadEventSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventSpaces();
      if (Array.isArray(data)) {
        setSpaces(data);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      console.error('Error loading event spaces:', err);
      setError(err.message || 'Unable to load event spaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventSpaces();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadEventSpaces().finally(() => setRefreshing(false));
  }, []);

  const filteredSpaces = spaces.filter(space =>
    space.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSpacePress = (space) => {
    navigation.navigate('EventSpaceDetails', { 
      spaceId: space.id,
      space: space 
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5D5FEE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search event spaces..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEventSpaces}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredSpaces}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <EventSpaceCard
              space={item}
              onPress={() => handleSpacePress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#5D5FEE']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No matching event spaces found' : 'No event spaces available'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: normalize(16)
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    paddingBottom: normalize(20)
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20)
  },
  errorText: {
    color: '#ff3b30',
    fontSize: normalize(16),
    marginBottom: normalize(16),
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#5D5FEE',
    padding: normalize(12),
    borderRadius: normalize(8)
  },
  retryButtonText: {
    color: 'white',
    fontSize: normalize(14),
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(20)
  },
  emptyText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center'
  }
});