import React, { useState, useEffect , } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, Alert, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';
import api from '../configs/api';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../configs/url';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    loadServices();
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
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

  // Use useFocusEffect to refresh services when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadServices();
    }, [])
  );

  const handleCreateService = () => {
    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }
    navigation.navigate('AddService');
  };

  const pickImage = async (serviceId) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Update the service image in the local state
        setServices(prevServices => 
          prevServices.map(service => 
            service.id === serviceId 
              ? { ...service, imageUrl: result.assets[0].uri }
              : service
          )
        );

        // Here you would typically upload the image to your server
        // and update the service with the new image URL
        const formData = new FormData();
        formData.append('image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });

        const token = await auth.currentUser.getIdToken();
        await api.put(`/services/${serviceId}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Error', 'Failed to update service image. Please try again.');
    }
  };

  const renderAuthModal = () => (
    <Modal
      visible={showAuthModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAuthModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalIconContainer}>
            <Ionicons name="lock-closed" size={40} color={theme.primary} />
          </View>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            Authentication Required
          </Text>
          <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
            You must be logged in to create a service. Would you like to sign in?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
              onPress={() => setShowAuthModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.signInButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                setShowAuthModal(false);
                navigation.navigate('Auth');
              }}
            >
              <Text style={[styles.modalButtonText, styles.signInButtonText]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderServiceItem = ({ item }) => {
    const imageUrl = item.imageUrl ? getImageUrl(item.imageUrl) : null;
    const isProvider = auth.currentUser && item.provider_id === auth.currentUser.uid;
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('ServiceDetails', { service: item })}
      >
        <View style={styles.imageContainer}>
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
          {isProvider && (
            <TouchableOpacity 
              style={styles.imageOverlay}
              onPress={() => pickImage(item.id)}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.imageOverlayText}>Change Image</Text>
            </TouchableOpacity>
          )}
        </View>
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
      {renderAuthModal()}
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: theme.primary }]}
        onPress={handleCreateService}
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
    color: '#4A90E2', // Light blue color for price
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
    backgroundColor: '#4A90E2', // Light blue for button
    elevation: 6,
    shadowColor: '#4A90E2',
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
    color: '#4A90E2', // Light blue for error text
  },
  retryButton: {
    padding: normalize(14),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(12),
    alignSelf: 'center',
    backgroundColor: '#4A90E2', // Light blue for retry button
    elevation: 3,
    shadowColor: '#4A90E2',
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
    color: '#4A90E2', // Light blue for price tag
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
    backgroundColor: '#4A90E2', // Light blue for status badge
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
    backgroundColor: '#4A90E2', // Light blue for FAB
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#4A90E2',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: normalize(20),
    padding: normalize(24),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalIconContainer: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: 'rgba(0, 149, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    marginBottom: normalize(12),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: normalize(16),
    textAlign: 'center',
    marginBottom: normalize(24),
    lineHeight: normalize(22),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: normalize(12),
    borderRadius: normalize(12),
    alignItems: 'center',
    marginHorizontal: normalize(6),
  },
  cancelButton: {
    borderWidth: 1,
  },
  signInButton: {
    backgroundColor: '#0095FF',
  },
  modalButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
  },
  signInButtonText: {
    color: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: tileSize - normalize(24),
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(8),
    opacity: 0,
  },
  imageOverlayText: {
    color: '#fff',
    marginLeft: normalize(8),
    fontSize: normalize(14),
    fontWeight: '600',
  },
});

export default AllServicesScreen;