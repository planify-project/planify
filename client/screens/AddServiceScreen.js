import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import api from '../configs/api';
import { normalize } from '../utils/scaling';
import { Auth } from '../configs/firebase_config';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../components/CustomAlert';
import { useAuth } from '../context/AuthContext';

export default function AddServiceScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'error'
  });

  useEffect(() => {
    if (!Auth.currentUser) {
      setAlertConfig({
        title: 'Authentication Required',
        message: 'You must be logged in to create a service',
        type: 'error'
      });
      setAlertVisible(true);
      navigation.goBack();
    }
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setAlertConfig({
          title: 'Permission Required',
          message: 'Sorry, we need camera roll permissions to make this work!',
          type: 'error'
        });
        setAlertVisible(true);
        return;
      }

      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Image picker result:', result);

      if (!result.canceled) {
        console.log('Image selected:', result.assets[0]);
        setImage({
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || 'image/jpeg',
          name: result.assets[0].fileName || 'photo.jpg'
        });
      } else {
        console.log('Image picking was canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setAlertConfig({
        title: 'Error',
        message: 'Failed to pick image. Please try again.',
        type: 'error'
      });
      setAlertVisible(true);
    }
  };

  const handleSubmit = async () => {
    if (!Auth.currentUser) {
      setAlertConfig({
        title: 'Authentication Required',
        message: 'You must be logged in to create a service',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    // Validate required fields
    if (!title || !description || !price) {
      setAlertConfig({
        title: 'Required Fields Missing',
        message: 'Please fill in all required fields',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    // Validate price is a valid number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setAlertConfig({ 
        title: 'Invalid Price',
        message: 'Please enter a valid price greater than 0',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    // Validate image
    if (!image) {
      setAlertConfig({
        title: 'Image Required',
        message: 'Please select an image for your service',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }
 
    try {
      setLoading(true);
      
      // Upload image to Cloudinary first
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: image.type,
        name: image.name
      });
      formData.append('upload_preset', 'planify');

      console.log('Starting Cloudinary upload with data:', {
        uri: image.uri,
        type: image.type,
        name: image.name
      });

      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dc3rbhdae/image/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Cloudinary response status:', cloudinaryResponse.status);
      
      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.text();
        console.error('Cloudinary upload failed:', errorData);
        throw new Error('Failed to upload image to Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      console.log('Cloudinary upload successful:', cloudinaryData);
      
      const imageUrl = cloudinaryData.secure_url;
      console.log('Image URL from Cloudinary:', imageUrl);
      
      // Create service with the Cloudinary URL
      const serviceData = {
        title,
        description,
        price: priceNum,
        provider_id: user.uid,
        image: imageUrl
      };

      // Get the Firebase ID token
      const token = await Auth.currentUser.getIdToken();
      console.log('Firebase token obtained');

      console.log('Creating service with data:', serviceData);

      const response = await api.post('/services', serviceData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000
      });

      console.log('Service creation response:', response.data);

      if (response.data.success) {
        setAlertConfig({
          title: 'Success', 
          message: 'Service created successfully!',
          type: 'success'
        });
        setAlertVisible(true);
        // Navigation will be handled in the alert button press
      } else {
        console.error('Service creation failed:', response.data);
        throw new Error(response.data.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      let errorMessage = 'Failed to create service. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAlertConfig({
        title: 'Error',
        message: errorMessage,
        type: 'error'
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Upload Section - Featured at the top */}
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            style={styles.imageSection} 
            onPress={pickImage}
          >
            {image ? (
              <>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.imageOverlayText}>Change Image</Text>
                </View>
              </>
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: theme.card }]}>
                <Ionicons name="images-outline" size={50} color={theme.primary} />
                <Text style={[styles.imagePlaceholderText, { color: theme.text }]}>
                  Add Service Image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              <Ionicons name="bookmark-outline" size={16} color={theme.primary} style={styles.inputIcon} />
              Service Title
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="What service are you offering?"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              <Ionicons name="document-text-outline" size={16} color={theme.primary} style={styles.inputIcon} />
              Description
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your service in detail..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              <Ionicons name="pricetag-outline" size={16} color={theme.primary} style={styles.inputIcon} />
              Price
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.submitButtonText}>Create Service</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        close={() => setAlertVisible(false)}
        buttons={[
          {
            text: 'OK',
            onPress: () => {
              setAlertVisible(false);
              if (alertConfig.type === 'success') {
                navigation.navigate('AllServices');
              }
            },
            style: alertConfig.type === 'success' ? 'success' : 'primary'
          }
        ]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    marginTop: normalize(24),
    paddingHorizontal: normalize(16),
  },
  imageSection: {
    borderRadius: normalize(16),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewImage: {
    width: '100%',
    height: normalize(220),
    borderRadius: normalize(16),
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
    padding: normalize(10),
  },
  imageOverlayText: {
    color: '#fff',
    marginLeft: normalize(8),
    fontSize: normalize(14),
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    height: normalize(220),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: normalize(12),
    fontSize: normalize(16),
    fontWeight: '500',
  },
  form: {
    padding: normalize(16),
    marginTop: normalize(8),
  },
  inputGroup: {
    marginBottom: normalize(20),
  },
  inputIcon: {
    marginRight: normalize(6),
  },
  label: {
    fontSize: normalize(16),
    marginBottom: normalize(8),
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderRadius: normalize(12),
    padding: normalize(14),
    fontSize: normalize(16),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  textArea: {
    height: normalize(120),
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: normalize(12),
    padding: normalize(16),
    alignItems: 'center',
    marginTop: normalize(16),
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: normalize(8),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});