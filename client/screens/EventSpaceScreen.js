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
import Ionicons from 'react-native-vector-icons/Ionicons';
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F6F7FB',
//     padding: normalize(16)
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: normalize(20)
//   },
//   errorText: {
//     color: '#FF3B30',
//     fontSize: normalize(16),
//     marginBottom: normalize(16),
//     textAlign: 'center'
//   },
//   retryButton: {
//     backgroundColor: '#6C6FD1',
//     paddingHorizontal: normalize(24),
//     paddingVertical: normalize(12),
//     borderRadius: normalize(8)
//   },
//   retryButtonText: {
//     color: '#FFFFFF',
//     fontSize: normalize(14),
//     fontWeight: 'bold'
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#666',
//     fontSize: normalize(16),
//     marginTop: normalize(20)
//   },
//   createEventButton: {
//     backgroundColor: '#6C6FD1',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: normalize(12),
//     borderRadius: normalize(12),
//     marginBottom: normalize(16),
//     shadowColor: '#6C6FD1',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.18,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   createEventText: {
//     color: '#fff',
//     fontSize: normalize(16),
//     fontWeight: 'bold',
//     marginLeft: normalize(8),
//   },
//   searchContainer: {
//     marginBottom: normalize(16)
//   }
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF', // Slightly bluer background for a fresh look
    padding: normalize(16),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
    backgroundColor: '#F8F9FF',
  },
  errorText: {
    color: '#FF3B5E', // Brighter error color
    fontSize: normalize(16),
    marginBottom: normalize(20),
    textAlign: 'center',
    lineHeight: normalize(22),
    maxWidth: '80%',
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
    letterSpacing: 0.3,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8A8BB3', // More vibrant secondary text color
    fontSize: normalize(16),
    marginTop: normalize(40),
    lineHeight: normalize(24),
    fontWeight: '500',
  },
  createEventButton: {
    backgroundColor: '#6C6FD1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(15),
    borderRadius: normalize(16),
    marginBottom: normalize(20),
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  createEventText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '700',
    marginLeft: normalize(10),
    letterSpacing: 0.2,
  },
  searchContainer: {
    marginBottom: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  // New styles for better visual hierarchy
  headerContainer: {
    marginBottom: normalize(20),
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: '800',
    color: '#333355',
    marginBottom: normalize(6),
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: '#8A8BB3',
    marginBottom: normalize(16),
    letterSpacing: 0.1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    marginVertical: normalize(16),
  },
  listContainer: {
    paddingBottom: normalize(20),
  },
  cardShadow: {
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  loadingIndicator: {
    color: '#6C6FD1',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: normalize(16),
    paddingHorizontal: normalize(4),
  },
  filterChip: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
    marginRight: normalize(10),
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
  },
  filterChipActive: {
    backgroundColor: '#6C6FD1',
  },
  filterChipText: {
    color: '#6C6FD1',
    fontWeight: '600',
    fontSize: normalize(13),
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  fabButton: {
    position: 'absolute',
    bottom: normalize(24),
    right: normalize(24),
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: '#6C6FD1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  fabIcon: {
    color: '#FFFFFF',
  },
  refreshIndicator: {
    color: '#6C6FD1',
  },
  searchInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 111, 209, 0.15)',
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(15),
    color: '#333355',
    paddingVertical: normalize(10),
    marginLeft: normalize(8),
  },
  searchIcon: {
    color: '#6C6FD1',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(40),
  },
  noResultsImage: {
    width: normalize(120),
    height: normalize(120),
    marginBottom: normalize(16),
    opacity: 0.8,
  },
  noResultsText: {
    fontSize: normalize(16),
    color: '#8A8BB3',
    textAlign: 'center',
    lineHeight: normalize(22),
    maxWidth: '80%',
  },
  statusBadge: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(12),
    backgroundColor: '#6AE056', // Green for available
    position: 'absolute',
    top: normalize(12),
    right: normalize(12),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '700',
  },
});
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
