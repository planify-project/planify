import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { normalize } from '../../utils/scaling';

export default function SearchBar({ placeholder, value, onChangeText }) {
  return (
    <View style={styles.container}>
      <FontAwesome name="search" size={20} color="#666" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#666"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: normalize(12),
    padding: normalize(12),
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: normalize(10),
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: '#333',
  },
});