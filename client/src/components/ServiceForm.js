import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useService } from '../context/ServiceContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const ServiceForm = () => {
  const { createService, updateService, services } = useService();
  const navigation = useNavigation();
  const route = useRoute();
  const isEdit = Boolean(route.params?.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    serviceType: '',
    image: null
  });

  useEffect(() => {
    if (isEdit) {
      const service = services.find(s => s.id === route.params.id);
      if (service) {
        setFormData({
          title: service.title,
          description: service.description,
          price: service.price.toString(),
          serviceType: service.serviceType,
          image: service.imageUrl
        });
      }
    }
  }, [route.params.id, services, isEdit]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Check file size
      if (blob.size > MAX_IMAGE_SIZE) {
        throw new Error('Image size must be less than 5MB');
      }

      // Check file type
      if (!ALLOWED_IMAGE_TYPES.includes(blob.type)) {
        throw new Error('Only JPEG, PNG and JPG images are allowed');
      }

      return true;
    } catch (error) {
      Alert.alert('Error', error.message);
      return false;
    }
  };

  const compressImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Resize to max width of 1200px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70% quality
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri; // Return original if compression fails
    }
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant gallery permissions to select photos');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        
        // Validate image
        const isValid = await validateImage(selectedAsset.uri);
        if (!isValid) return;

        // Compress image
        const compressedUri = await compressImage(selectedAsset.uri);
        
        setFormData(prev => ({
          ...prev,
          image: {
            uri: compressedUri,
            type: 'image/jpeg',
            name: 'photo.jpg'
          }
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Choose Image Source',
      'Where would you like to get the image from?',
      [
        {
          text: 'Camera',
          onPress: () => pickImage('camera')
        },
        {
          text: 'Gallery',
          onPress: () => pickImage('gallery')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateService(route.params.id, formData);
      } else {
        await createService(formData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save service');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity 
          style={styles.imagePickerButton} 
          onPress={showImagePickerOptions}
        >
          {formData.image ? (
            <Image 
              source={{ uri: formData.image.uri || formData.image }} 
              style={styles.previewImage}
            />
          ) : (
            <Text style={styles.imagePickerText}>Select Image</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Service title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Service description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={formData.price}
          onChangeText={(value) => handleChange('price', value)}
          placeholder="Service price"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Service Type</Text>
        <TextInput
          style={styles.input}
          value={formData.serviceType}
          onChangeText={(value) => handleChange('serviceType', value)}
          placeholder="Service type"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isEdit ? 'Update Service' : 'Create Service'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  imagePickerButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePickerText: {
    color: '#6b7280',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceForm; 