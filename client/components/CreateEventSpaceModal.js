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
  Switch,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { normalize } from '../utils/scaling';
import api from '../configs/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CreateEventSpaceModal({ visible, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    amenities: {},
    images: [],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

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

  const handleImageAdd = () => {
    if (newImageUrl.trim() !== '') {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const handleImageRemove = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location || !formData.price) {
      Alert.alert('Validation Error', 'Please fill in name, location, and price.');
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      const response = await api.post('/event-spaces', submissionData);

      if (response?.data?.success) {
        Alert.alert('Success', 'Event space created successfully!');
        onSuccess(response.data.data); // Pass the new event space data
        onClose();
        setFormData({
          name: '',
          description: '',
          location: '',
          price: '',
          amenities: {},
          images: [],
        });
      } else {
        Alert.alert('Creation Failed', response?.data?.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error creating event space:', error);
      Alert.alert('Error', 'An error occurred while creating the event space.');
    } finally {
      setLoading(false);
    }
  };

  const amenityOptions = ['pool', 'wifi', 'parking', 'catering', 'beach_access'];

  const modalStyle = {
    transform: [{
      scale: modalAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      }),
    }],
    opacity: modalAnimation,
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, modalStyle]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Event Space</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter event space name"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Describe the event space"
                  multiline
                  numberOfLines={4}
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                />
              </View>

              {/* Location Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter location"
                  value={formData.location}
                  onChangeText={(text) => handleInputChange('location', text)}
                />
              </View>

              {/* Price Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price (per day)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price in DT"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(text) => handleInputChange('price', text)}
                />
              </View>

              {/* Amenities */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amenities</Text>
                {amenityOptions.map(amenity => (
                  <View key={amenity} style={styles.amenityRow}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                    <Switch
                      value={!!formData.amenities[amenity]}
                      onValueChange={(value) => handleAmenityChange(amenity, value)}
                      trackColor={{ false: '#767577', true: '#5D5FEE' }}
                      thumbColor={formData.amenities[amenity] ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                ))}
              </View>

              {/* Images Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Images (URLs)</Text>
                <View style={styles.imageInputContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Paste image URL"
                    value={newImageUrl}
                    onChangeText={setNewImageUrl}
                  />
                  <TouchableOpacity onPress={handleImageAdd} style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                {formData.images.map((url, index) => (
                  <View key={index} style={styles.addedImageRow}>
                    <Text style={styles.imageUrl} numberOfLines={1}>{url}</Text>
                    <TouchableOpacity onPress={() => handleImageRemove(index)}>
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </KeyboardAvoidingView>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Create Space</Text>
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
    backgroundColor: '#fff',
    borderRadius: normalize(20),
    width: width * 0.9,
    maxHeight: '85%',
    padding: normalize(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    paddingBottom: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: normalize(5),
  },
  formContainer: {
    maxHeight: '70%',
  },
  inputGroup: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(16),
    color: '#444',
    marginBottom: normalize(8),
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(12),
    padding: normalize(12),
    fontSize: normalize(16),
    color: '#333',
    backgroundColor: '#f8f8f8',
  },
  messageInput: {
    height: normalize(100),
    textAlignVertical: 'top',
  },
  amenityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    backgroundColor: '#f8f8f8',
    borderRadius: normalize(8),
  },
  amenityText: {
    fontSize: normalize(16),
    color: '#444',
    textTransform: 'capitalize',
  },
  imageInputContainer: {
    flexDirection: 'row',
    gap: normalize(10),
    marginBottom: normalize(10),
  },
  addButton: {
    backgroundColor: '#5D5FEE',
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedImageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(8),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    backgroundColor: '#f8f8f8',
    borderRadius: normalize(8),
  },
  imageUrl: {
    flex: 1,
    fontSize: normalize(14),
    color: '#666',
    marginRight: normalize(8),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: normalize(20),
    gap: normalize(10),
  },
  button: {
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(12),
    minWidth: normalize(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#5D5FEE',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
