import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { useService } from '../context/ServiceContext';
import { useNavigation } from '@react-navigation/native';

const ServiceList = () => {
  const { services, loading, error, deleteService, fetchServices } = useService();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchServices();
    } catch (error) {
      console.error('Error refreshing services:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      Alert.alert(
        'Delete Service',
        'Are you sure you want to delete this service?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteService(id);
              await fetchServices(); // Refresh after delete
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting service:', error);
      Alert.alert('Error', 'Failed to delete service');
    }
  };

  const renderService = ({ item }) => {
    console.log('Rendering service:', {
      id: item.id,
      name: item.name,
      title: item.title,
      imageUrl: item.imageUrl,
      coverImage: item.coverImage,
      fullItem: item
    });

    const imageUri = item.imageUrl || item.coverImage;
    console.log('Image URI:', imageUri);

    return (
      <View style={styles.serviceCard}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.serviceImage}
            resizeMode="cover"
            onError={(error) => {
              console.error('Image loading error:', {
                serviceId: item.id,
                serviceTitle: item.title,
                imageUri,
                error: error.nativeEvent
              });
            }}
          />
        ) : (
          <View style={[styles.serviceImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.title || item.name}</Text>
          <Text style={styles.serviceDescription}>{item.description}</Text>
          <View style={styles.serviceDetails}>
            <Text style={styles.servicePrice}>${item.price}</Text>
            <Text style={styles.serviceType}>{item.serviceType}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ServiceForm', { id: item.id })}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading services...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ServiceForm')}
      >
        <Text style={styles.addButtonText}>Add New Service</Text>
      </TouchableOpacity>
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    marginRight: 8,
    padding: 8,
  },
  editButtonText: {
    color: '#3b82f6',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: '#ef4444',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ServiceList; 