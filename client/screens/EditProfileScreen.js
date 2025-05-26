import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Auth } from '../configs/firebase_config';
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import api from '../configs/api';

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
        quality: 0.8,
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
        await api.put(`/users/${user.uid}`, {
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
        <Text style={styles.avatarText}>Tap to change photo</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={normalize(20)} color="#5D5FEE" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={normalize(20)} color="#fff" />
              <Text style={styles.buttonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: normalize(24),
    backgroundColor: '#fff',
    borderBottomLeftRadius: normalize(24),
    borderBottomRightRadius: normalize(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: normalize(12),
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: normalize(14),
    color: '#666',
    marginTop: normalize(8),
  },
  form: {
    padding: normalize(24),
  },
  inputContainer: {
    marginBottom: normalize(24),
  },
  label: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: normalize(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: normalize(12),
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    paddingVertical: normalize(14),
    color: '#333',
  },
  button: {
    backgroundColor: '#8d8ff3',
    borderRadius: normalize(8),
    padding: normalize(16),
     alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D5FEE',
    borderRadius: normalize(12),
    padding: normalize(16),
    shadowColor: '#5D5FEE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: '600',
    marginLeft: normalize(8),
  },
}); 