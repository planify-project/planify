import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import api from '../configs/api';
import { normalize } from '../utils/scaling';
import { auth } from '../configs/config';

export default function AddServiceScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

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
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', 'planify_services');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dxqg8zq8d/image/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = '';
      
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const serviceData = {
        title,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || 'https://via.placeholder.com/150',
        serviceType: 'general',
        userId: auth.currentUser.uid
      };

      const response = await api.post('/services', serviceData);

      console.log('Service created:', response.data);
      Alert.alert('Success', 'Service created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('AllServices')
        }
      ]);
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert('Error', 'Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.text }]}>Title *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter service title"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.text }]}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.card, color: theme.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter service description"
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, { color: theme.text }]}>Price (DT) *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.imageButton, { backgroundColor: theme.primary }]} 
          onPress={pickImage}
        >
          <Text style={styles.imageButtonText}>Pick an image</Text>
        </TouchableOpacity>

        {image && (
          <Image 
            source={{ uri: image }} 
            style={styles.previewImage} 
          />
        )}

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: normalize(16),
  },
  label: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(16),
    fontSize: normalize(16),
  },
  textArea: {
    height: normalize(100),
    textAlignVertical: 'top',
  },
  imageButton: {
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  imageButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(8),
    marginBottom: normalize(16),
  },
  submitButton: {
    padding: normalize(16),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginTop: normalize(16),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
}); 