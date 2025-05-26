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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Auth } from '../configs/firebase_config';
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = Auth.currentUser;
    if (currentUser) {
      setName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1, // Very low quality to reduce size
      });

      if (!result.canceled) {
        setPhotoURL(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleUpdate = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const user = Auth.currentUser;
      
      if (!user) {
        Alert.alert('Error', 'No user found. Please sign in again.');
        return;
      }

      let newPhotoURL = photoURL;
      let newName = name.trim() || user.displayName || '';

      // Update Firebase profile
      await updateProfile(user, {
        displayName: newName,
        ...(newPhotoURL && { photoURL: newPhotoURL })
      });

      // Update user in database
      try {
        await axios.put(`${API_BASE}/users/${user.uid}`, {
          name: newName,
          ...(newPhotoURL && { photoURL: newPhotoURL })
        });
      } catch (error) {
        console.error('Error updating user in database:', error);
        // Continue even if database update fails
      }

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={normalize(60)} color="#8d8ff3" />
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Ionicons name="camera" size={normalize(20)} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: normalize(20),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: normalize(15),
  },
  avatar: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
  },
  avatarPlaceholder: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8d8ff3',
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    padding: normalize(20),
  },
  inputContainer: {
    marginBottom: normalize(20),
  },
  label: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: '#333',
    marginBottom: normalize(8),
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    padding: normalize(12),
    fontSize: normalize(16),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#8d8ff3',
    borderRadius: normalize(8),
    padding: normalize(16),
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '600',
  },
}); 