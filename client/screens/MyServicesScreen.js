import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import api from '../configs/api';
import { getAuth } from 'firebase/auth';

const MyServicesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    loadMyServices();
  }, []);

  const loadMyServices = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await api.get(`/services/provider/${userId}`);
      setServices(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading services:', error);
      setError(error.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.serviceCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('Services', { 
        screen: 'AllServicesScreen',
        params: { service: item }
      })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://picsum.photos/300/300' }}
        style={styles.serviceImage}
      />
      <View style={styles.serviceInfo}>
        <Text style={[styles.serviceTitle, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.serviceDescription, { color: theme.text }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.servicePrice, { color: theme.primary }]}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={loadMyServices}
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
          <Text style={[styles.emptyText, { color: theme.text }]}>
            You haven't created any services yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadMyServices}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16)
  },
  listContainer: {
    padding: normalize(8)
  },
  serviceCard: {
    marginBottom: normalize(16),
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
    height: normalize(200),
    resizeMode: 'cover'
  },
  serviceInfo: {
    padding: normalize(16)
  },
  serviceTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(8)
  },
  serviceDescription: {
    fontSize: normalize(14),
    marginBottom: normalize(8)
  },
  servicePrice: {
    fontSize: normalize(16),
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20)
  },
  emptyText: {
    fontSize: normalize(16),
    textAlign: 'center'
  },
  errorText: {
    fontSize: normalize(16),
    textAlign: 'center',
    marginTop: normalize(20),
    marginBottom: normalize(10)
  },
  retryButton: {
    padding: normalize(10),
    borderRadius: normalize(8),
    alignSelf: 'center'
  },
  retryButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold'
  }
});

export default MyServicesScreen; 