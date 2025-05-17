import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../configs/api';
import { normalize } from '../utils/scaling';

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = width / numColumns;

export default function AllServicesScreen({ navigation }) {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Starting to fetch services...');
      setLoading(true);
      setError(null);
      
      const response = await api.get('/services');
      console.log('Raw API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data.success) {
        const formattedServices = response.data.data.map(service => {
          console.log('Processing service:', service);
          // Construct the full image URL using the API base URL, removing /api from the path
          const baseUrl = api.defaults.baseURL.replace('/api', '');
          const fullImageUrl = service.imageUrl 
            ? `${baseUrl}${service.imageUrl}`
            : 'https://via.placeholder.com/150';
          
          console.log('Full image URL:', fullImageUrl);
          return {
            ...service,
            imageUrl: fullImageUrl
          };
        });
        console.log('Formatted services:', formattedServices);
        setServices(formattedServices);
      } else {
        console.error('API returned success: false');
        setError('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      console.error('Error details:', error.response?.data);
      setError(error.message || 'Failed to fetch services');
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
        onPress={() => navigation.navigate('ServiceDetail', { service: item })}
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
      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>No services created yet</Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('AddService')}
          >
            <Text style={styles.createButtonText}>Create Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.listContainer}
            onRefresh={fetchServices}
            refreshing={loading}
          />
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('AddService')}
          >
            <Text style={styles.createButtonText}>Create Service</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
  },
  serviceCard: {
    width: tileSize - 16,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  serviceImage: {
    width: '100%',
    height: tileSize - 16,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
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
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginVertical: normalize(16),
    marginHorizontal: normalize(16),
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