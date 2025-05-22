import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import api from '../configs/api';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../configs/url';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = (width - normalize(48)) / numColumns;

const fetchServices = async () => {
  try {
    console.log('Starting to fetch services...');
    const response = await api.get('/services');
    console.log('Services response:', response.data);
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

const AllServicesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const renderServiceItem = ({ item }) => {
    console.log('Rendering service item:', item);
    const imageUrl = getImageUrl(item.image_url);
    console.log('Service card image URL:', imageUrl);
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('ServiceDetails', { service: item })}
      >
        <Image
          source={{ uri: imageUrl || 'https://picsum.photos/300/300' }}
          style={styles.serviceImage}
          onError={(e) => {
            console.error('Image loading error for service:', {
              id: item.id,
              title: item.title,
              imageUrl: imageUrl,
              error: e.nativeEvent.error
            });
          }}
        />
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceTitle, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.servicePrice, { color: theme.primary }]}>{item.price} DT</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={loadServices}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddService')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.createButtonIcon} />
        <Text style={styles.createButtonText}>Create New Service</Text>
      </TouchableOpacity>

      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: normalize(16)
//   },
//   listContainer: {
//     padding: normalize(8)
//   },
//   serviceCard: {
//     flex: 1,
//     margin: normalize(8),
//     width: tileSize - normalize(16),
//     borderRadius: normalize(12),
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84
//   },
//   serviceImage: {
//     width: '100%',
//     height: tileSize - normalize(16),
//     resizeMode: 'cover'
//   },
//   serviceInfo: {
//     padding: normalize(12)
//   },
//   serviceTitle: {
//     fontSize: normalize(16),
//     fontWeight: 'bold',
//     marginBottom: normalize(4)
//   },
//   servicePrice: {
//     fontSize: normalize(14),
//     fontWeight: 'bold'
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   createButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: normalize(12),
//     borderRadius: normalize(8),
//     marginVertical: normalize(16),
//     marginHorizontal: normalize(16),
//   },
//   createButtonIcon: {
//     marginRight: normalize(8),
//   },
//   createButtonText: {
//     color: '#fff',
//     fontSize: normalize(16),
//     fontWeight: 'bold',
//   },
//   loadingText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   retryButton: {
//     padding: 10,
//     borderRadius: 8,
//     alignSelf: 'center',
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16),
    backgroundColor: '#F8F9FC', // Soft light background
  },
  listContainer: {
    padding: normalize(4),
    paddingBottom: normalize(80),
  },
  serviceCard: {
    flex: 1,
    margin: normalize(8),
    width: tileSize - normalize(16),
    borderRadius: normalize(24), // More rounded corners
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  serviceImage: {
    width: '100%',
    height: tileSize - normalize(24),
    resizeMode: 'cover',
    backgroundColor: '#EDF1F7', // Light gray placeholder
  },
  serviceInfo: {
    padding: normalize(16),
    borderTopWidth: 1,
    borderTopColor: '#EDF1F7',
  },
  serviceTitle: {
    fontSize: normalize(15),
    fontWeight: '700',
    marginBottom: normalize(6),
    color: '#222B45',
    letterSpacing: 0.1,
  },
  servicePrice: {
    fontSize: normalize(14),
    fontWeight: '800',
    color: '#FF3D71', // Vibrant pink/red for price
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
  },
  emptyText: {
    fontSize: normalize(16),
    marginBottom: normalize(24),
    textAlign: 'center',
    color: '#8F9BB3',
    lineHeight: normalize(24),
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(16),
    borderRadius: normalize(16),
    marginVertical: normalize(16),
    marginHorizontal: normalize(16),
    backgroundColor: '#0095FF', // Bright blue
    elevation: 6,
    shadowColor: '#0095FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonIcon: {
    marginRight: normalize(10),
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingText: {
    fontSize: normalize(16),
    textAlign: 'center',
    marginTop: normalize(24),
    color: '#8F9BB3',
  },
  errorText: {
    fontSize: normalize(16),
    textAlign: 'center',
    marginTop: normalize(24),
    marginBottom: normalize(16),
    color: '#FF3D71', // Vibrant pink/red for errors
  },
  retryButton: {
    padding: normalize(14),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(12),
    alignSelf: 'center',
    backgroundColor: '#0095FF', // Bright blue
    elevation: 3,
    shadowColor: '#0095FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '700',
  },
  // New styles with a different approach
  cardWrapper: {
    borderRadius: normalize(24),
    marginBottom: normalize(12),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImageContainer: {
    borderRadius: normalize(16),
    overflow: 'hidden',
    marginRight: normalize(12),
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceTag: {
    position: 'absolute',
    top: normalize(12),
    right: normalize(12),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceTagText: {
    color: '#FF3D71',
    fontWeight: '800',
    fontSize: normalize(14),
  },
  priceTagIcon: {
    marginRight: normalize(4),
  },
  statusBadge: {
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
    backgroundColor: '#00E096', // Green for available
    alignSelf: 'flex-start',
    marginTop: normalize(6),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: normalize(10),
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(6),
  },
  ratingText: {
    fontSize: normalize(12),
    color: '#8F9BB3',
    marginLeft: normalize(4),
  },
  starIcon: {
    marginRight: normalize(2),
  },
  headerSection: {
    marginBottom: normalize(20),
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: '800',
    color: '#222B45',
    marginBottom: normalize(6),
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: '#8F9BB3',
    lineHeight: normalize(20),
  },
  fabButton: {
    position: 'absolute',
    bottom: normalize(24),
    right: normalize(24),
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    backgroundColor: '#0095FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#0095FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
  },
  cardShadow: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(24),
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
});

export default AllServicesScreen;