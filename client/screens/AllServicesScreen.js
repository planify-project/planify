import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import api from '../configs/api'; // Add this import
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = (width - normalize(48)) / numColumns; // Define tileSize before styles

const fetchServices = async () => {
  try {
    console.log('Starting to fetch services...');
    const response = await api.get('/services'); // Remove duplicate 'api' prefix
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
    console.log('Service card image URL:', item.imageUrl);
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, { backgroundColor: theme.card }]}
        onPress={() => navigation.getParent()?.navigate('Services', {
          screen: 'ServiceDetails',
          params: { service: item }
        })}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.serviceImage}
          onError={(e) => {
            console.error('Image loading error for service:', {
              id: item.id,
              title: item.title,
              imageUrl: item.imageUrl,
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
          onPress={fetchServices}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16)
  },
  listContainer: {
    padding: normalize(8)
  },
  serviceCard: {
    flex: 1,
    margin: normalize(8),
    width: tileSize - normalize(16),
    borderRadius: normalize(12),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  serviceImage: {
    width: '100%',
    height: tileSize - normalize(16),
    resizeMode: 'cover'
  },
  serviceInfo: {
    padding: normalize(12)
  },
  serviceTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(4)
  },
  servicePrice: {
    fontSize: normalize(14),
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(12),
    borderRadius: normalize(8),
    marginVertical: normalize(16),
    marginHorizontal: normalize(16),
  },
  createButtonIcon: {
    marginRight: normalize(8),
  },
  createButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AllServicesScreen;