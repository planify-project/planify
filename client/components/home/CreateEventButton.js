import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const CreateEventButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="add-circle-outline" size={24} color="#fff" />
      <Text style={styles.buttonText}>Create Event</Text>
    </TouchableOpacity>
  );
};

export default CreateEventButton;