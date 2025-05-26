import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions
} from 'react-native';
import { fetchEventSpaces } from '../configs/EventSpaceAPI';
import EventSpaceCard from '../components/eventSpace/EventSpaceCard';
import SearchBar from '../components/common/SearchBar';
import { normalize } from '../utils/scaling';
import { Ionicons } from '@expo/vector-icons';
import CreateEventSpaceModal from '../components/CreateEventSpaceModal';

const { width } = Dimensions.get('window');

export default function EventSpaceScreen({ navigation }) {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));

  const loadEventSpaces = async () => {
    try {
      setError(null);
      const data = await fetchEventSpaces();
      
      if (!data) {
        throw new Error('No event spaces data received');
      }
      
      const spacesData = Array.isArray(data) ? data : [];
      setSpaces(spacesData);
      setFilteredSpaces(spacesData);
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

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSpaces(spaces);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = spaces.filter(space => 
        space.name.toLowerCase().includes(query) ||
        space.location.toLowerCase().includes(query) ||
        space.description?.toLowerCase().includes(query)
      );
      setFilteredSpaces(filtered);
    }
  }, [searchQuery, spaces]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadEventSpaces().finally(() => setRefreshing(false));
  }, []);

  const handleRetry = () => {
    setLoading(true);
    loadEventSpaces();
  };

  const handleEventSpaceCreated = (newSpace) => {
    setSpaces(prevSpaces => [newSpace, ...prevSpaces]);
    setIsCreateModalVisible(false);
  };

  const animateFab = (scale) => {
    Animated.spring(fabScale, {
      toValue: scale,
      useNativeDriver: true,
      friction: 4,
      tension: 40
    }).start();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C6FD1" />
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
        <Text style={styles.headerTitle}>Event Spaces</Text>
        <Text style={styles.headerSubtitle}>Find the perfect venue for your event</Text>
        <SearchBar
          placeholder="Search by name, location, or description..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredSpaces}
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
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#8A8BB3" />
            <Text style={styles.emptyText}>No event spaces found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <Animated.View 
        style={[
          styles.fabContainer,
          { transform: [{ scale: fabScale }] }
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsCreateModalVisible(true)}
          onPressIn={() => animateFab(0.95)}
          onPressOut={() => animateFab(1)}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

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
    backgroundColor: '#F8F9FF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
  },
  errorText: {
    color: '#FF3B5E',
    fontSize: normalize(16),
    marginBottom: normalize(20),
    textAlign: 'center',
    lineHeight: normalize(22),
  },
  retryButton: {
    backgroundColor: '#6C6FD1',
    paddingHorizontal: normalize(28),
    paddingVertical: normalize(14),
    borderRadius: normalize(12),
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '700',
  },
  headerContainer: {
    padding: normalize(20),
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: normalize(24),
    borderBottomRightRadius: normalize(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: '800',
    color: '#2A2A3C',
    marginBottom: normalize(6),
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: '#8A8BB3',
    marginBottom: normalize(16),
  },
  searchBar: {
    marginTop: normalize(8),
  },
  listContainer: {
    padding: normalize(16),
    paddingBottom: normalize(100),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(40),
  },
  emptyText: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#2A2A3C',
    marginTop: normalize(16),
  },
  emptySubtext: {
    fontSize: normalize(14),
    color: '#8A8BB3',
    marginTop: normalize(8),
  },
  fabContainer: {
    position: 'absolute',
    bottom: normalize(24),
    right: normalize(24),
  },
  fab: {
    width: normalize(64),
    height: normalize(64),
    borderRadius: normalize(32),
    backgroundColor: '#6C6FD1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
});
