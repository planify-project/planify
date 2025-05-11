import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import api from '../configs/api';
import { normalize } from '../utils/scaling';
import { Auth } from '../configs/firebase_config';
import { Ionicons } from '@expo/vector-icons';

export default function AddServiceScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [serviceType, setServiceType] = useState('general');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!Auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to create a service');
      navigation.goBack();
    }
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage({
        uri: result.assets[0].uri,
      type: 'image/jpeg',
        name: 'photo.jpg'
      });
    }
  };

  const ensureUserExists = async () => {
    try {
      const token = await Auth.currentUser.getIdToken();
      const response = await api.post('/users/firebase', {
        uid: Auth.currentUser.uid,
        email: Auth.currentUser.email,
        displayName: Auth.currentUser.displayName
      }, {
          headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!Auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to create a service');
      return;
    }

    // Validate required fields
    if (!title || !description || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate price is a valid number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      setLoading(true);
      
      // Ensure user exists in database
      const user = await ensureUserExists();
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', priceNum.toString());
      formData.append('serviceType', serviceType);
      formData.append('provider_id', user.id);
      
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });
      }

      // Get the Firebase ID token
      const token = await Auth.currentUser.getIdToken();

      console.log('Creating service with data:', {
        title,
        description,
        price: priceNum,
        serviceType,
        provider_id: user.id
      });

      const response = await api.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Service creation response:', response.data);

      if (response.data.success) {
      Alert.alert('Success', 'Service created successfully', [
        {
          text: 'OK',
            onPress: () => navigation.navigate('AllServices')
        }
      ]);
      } else {
        throw new Error(response.data.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to create service. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create Service</Text>
        </View>

        {/* Form Section */}
      <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter service title"
          placeholderTextColor={theme.textSecondary}
        />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter service description"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
        />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Price ($)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
        />
          </View>

          {/* Image Upload Section - Moved below the form */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Service Image</Text>
        <TouchableOpacity 
              style={styles.imageSection} 
          onPress={pickImage}
        >
              {image ? (
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.card }]}>
                  <Ionicons name="camera-outline" size={40} color={theme.primary} />
                  <Text style={[styles.imagePlaceholderText, { color: theme.text }]}>
                    Add Service Image
                  </Text>
                </View>
              )}
        </TouchableOpacity>
          </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Service</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: normalize(8),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginLeft: normalize(16),
  },
  imageSection: {
    padding: normalize(16),
  },
  previewImage: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(12),
  },
  imagePlaceholder: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: normalize(8),
    fontSize: normalize(16),
  },
  form: {
    padding: normalize(16),
  },
  inputGroup: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(14),
    marginBottom: normalize(8),
    fontWeight: 'bold',
  },
  input: {
    borderRadius: normalize(8),
    padding: normalize(12),
    fontSize: normalize(16),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: normalize(100),
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: normalize(8),
    padding: normalize(16),
    alignItems: 'center',
    marginTop: normalize(16),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
}); 