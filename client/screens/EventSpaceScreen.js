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
import CreateEventSpaceModal from '../components/CreateEventSpaceModal';

export default function EventSpaceScreen({ navigation }) {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const loadEventSpaces = async () => {
    try {
      setError(null);
      console.log('Starting to load event spaces...');
      const data = await fetchEventSpaces();
      
      if (!data) {
        throw new Error('No event spaces data received');
      }
      
      console.log('Successfully loaded event spaces:', data);
      setSpaces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error in loadEventSpaces:', err);
      setError(
        err.response?.status === 404 
          ? 'Event spaces endpoint not found. Please check server configuration.' 
          : 'Unable to load event spaces. Please try again.'
      );
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

  const handleEventSpaceCreated = (newSpace) => {
    console.log('New event space created:', newSpace);
    setSpaces(prevSpaces => [newSpace, ...prevSpaces]);
    setIsCreateModalVisible(false);
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
      <View style={styles.headerContainer}>
        <SearchBar
          placeholder="Search event spaces..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchBar}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <Text style={styles.createButtonText}>Create New Space</Text>
      </TouchableOpacity>

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
        ListEmptyComponent={!loading && !error && (
          <Text style={styles.emptyText}>No event spaces available</Text>
        )}
        contentContainerStyle={spaces.length === 0 ? styles.emptyListContainer : null}
      />

      <CreateEventSpaceModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSuccess={handleEventSpaceCreated}
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
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: normalize(12),
  },
  searchBar: {
    width: '100%',
  },
  createButton: {
    backgroundColor: '#5D5FEE',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(14),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: normalize(16),
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});
