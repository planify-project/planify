import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { normalize } from '../utils/scaling';
import api from '../configs/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function CreateEventSpaceModal({ visible, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    capacity: '',
    amenities: {},
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const auth = getAuth();

  React.useEffect(() => {
    if (visible) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAmenityChange = (amenity, value) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: value,
      },
    });
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            uri: result.assets[0].uri,
            type: 'image/jpeg',
            name: 'photo.jpg'
          }]
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('capacity', formData.capacity || 0);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      formDataToSend.append('isActive', 'true');
      formDataToSend.append('availability', JSON.stringify({}));

      // Add all images to formData
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `photo${index}.jpg`
        });
      });

      const response = await api.post('/event-spaces', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Event space created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                onSuccess(response.data.data);
                onClose();
              }
            }
          ]
        );
      } else {
        throw new Error(response.data.message || 'Failed to create space');
      }
    } catch (error) {
      console.error('Error creating space:', error);
      Alert.alert('Error', error.message || 'Failed to create space. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const amenityOptions = [
    { key: 'pool', label: 'Swimming Pool', icon: 'water-outline' },
    { key: 'wifi', label: 'WiFi', icon: 'wifi-outline' },
    { key: 'parking', label: 'Parking', icon: 'car-outline' },
    { key: 'catering', label: 'Catering', icon: 'restaurant-outline' },
    { key: 'beach_access', label: 'Beach Access', icon: 'umbrella-outline' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
              opacity: modalAnimation,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Event Space</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
            >
              {/* Image Upload Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Photos</Text>
                <View style={styles.imageGrid}>
                  {formData.images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: image.uri }} style={styles.uploadedImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleImageRemove(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#FF3B5E" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {formData.images.length < 5 && (
                    <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                      <Ionicons name="add-circle-outline" size={32} color="#6C6FD1" />
                      <Text style={styles.addImageText}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Basic Information Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    placeholder="Enter space name"
                    placeholderTextColor="#8A8BB3"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.messageInput]}
                    value={formData.description}
                    onChangeText={(value) => handleInputChange('description', value)}
                    placeholder="Describe your event space..."
                    placeholderTextColor="#8A8BB3"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(value) => handleInputChange('location', value)}
                    placeholder="Enter location"
                    placeholderTextColor="#8A8BB3"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.price}
                      onChangeText={(value) => handleInputChange('price', value)}
                      placeholder="Enter price"
                      placeholderTextColor="#8A8BB3"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Capacity</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.capacity}
                      onChangeText={(value) => handleInputChange('capacity', value)}
                      placeholder="Enter capacity"
                      placeholderTextColor="#8A8BB3"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Amenities Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.amenitiesGrid}>
                  {amenityOptions.map((amenity) => (
                    <TouchableOpacity
                      key={amenity.key}
                      style={[
                        styles.amenityButton,
                        formData.amenities[amenity.key] && styles.amenityButtonActive
                      ]}
                      onPress={() => handleAmenityChange(amenity.key, !formData.amenities[amenity.key])}
                    >
                      <Ionicons
                        name={amenity.icon}
                        size={24}
                        color={formData.amenities[amenity.key] ? '#FFFFFF' : '#6C6FD1'}
                      />
                      <Text
                        style={[
                          styles.amenityText,
                          formData.amenities[amenity.key] && styles.amenityTextActive
                        ]}
                      >
                        {amenity.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Create Space</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: '#2A2A3C',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#2A2A3C',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: normalize(14),
    color: '#8A8BB3',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 15,
    fontSize: normalize(15),
    color: '#2A2A3C',
    borderWidth: 1,
    borderColor: '#E8E9F3',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageContainer: {
    width: (width * 0.9 - 60) / 3,
    height: (width * 0.9 - 60) / 3,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  addImageButton: {
    width: (width * 0.9 - 60) / 3,
    height: (width * 0.9 - 60) / 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E9F3',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    marginTop: 8,
    fontSize: normalize(12),
    color: '#8A8BB3',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E9F3',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  amenityButtonActive: {
    backgroundColor: '#6C6FD1',
    borderColor: '#6C6FD1',
  },
  amenityText: {
    marginLeft: 8,
    fontSize: normalize(14),
    color: '#6C6FD1',
  },
  amenityTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
  },
  submitButton: {
    backgroundColor: '#6C6FD1',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});
