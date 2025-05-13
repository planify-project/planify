import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import api from '../configs/api';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function EditServiceScreen({ route, navigation }) {
  const { service } = route.params;
  const { theme } = useTheme();
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [price, setPrice] = useState(service.price.toString());
  const [serviceType, setServiceType] = useState(service.serviceType);
  const [image, setImage] = useState(service.imageUrl);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (!title || !description || !price || !serviceType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('serviceType', serviceType);
      
      if (image && image.startsWith('file://')) {
        const imageUri = image;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type
        });
      }

      const response = await api.put(`/services/${service.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Service updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update service');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.message || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={normalize(40)} color="#5D5FEE" />
              <Text style={styles.imagePlaceholderText}>Add Service Image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter service title"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter service description"
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price (DT)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Type</Text>
          <TextInput
            style={styles.input}
            value={serviceType}
            onChangeText={setServiceType}
            placeholder="Enter service type"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.actionButtons}>
        <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#5D5FEE' }]}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="close-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#5D5FEE' }]}
            onPress={handleUpdate}
          disabled={loading}
        >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Save Changes</Text>
              </>
            )}
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FC',
  },
  imageContainer: {
    padding: normalize(16),
  },
  imagePicker: {
    width: '100%',
    height: normalize(200),
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholderText: {
    marginTop: normalize(8),
    color: '#5D5FEE',
    fontSize: normalize(16),
  },
  form: {
    padding: normalize(16),
  },
  inputContainer: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(14),
    color: '#222',
    marginBottom: normalize(8),
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 