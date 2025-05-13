import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { fetchEventSpaces } from '../configs/EventSpaceAPI';
import EventSpaceCard from '../components/eventSpace/EventSpaceCard';
import SearchBar from '../components/common/SearchBar';
import { normalize } from '../utils/scaling';

export default function EventSpaceScreen({ navigation }) {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadEventSpaces = async () => {
    try {
      setError(null);
      const data = await fetchEventSpaces();
      console.log('Loaded event spaces:', data);
      setSpaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error in loadEventSpaces:', err);
      setError('Unable to load event spaces. Please try again.');
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

  const handleRetry = () => {
    setLoading(true);
    loadEventSpaces();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5D5FEE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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
      <FlatList
        data={spaces}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <EventSpaceCard
            space={item}
            onPress={() => navigation.navigate('EventSpaceDetails', { space: item })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No event spaces available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: normalize(16)
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20)
  },
  errorText: {
    color: '#FF3B30',
    fontSize: normalize(16),
    marginBottom: normalize(16),
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#5D5FEE',
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(12),
    borderRadius: normalize(8)
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(14),
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: normalize(16),
    marginTop: normalize(20)
  }
});