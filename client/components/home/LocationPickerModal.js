import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { styles } from './styles';

const LocationPickerModal = ({ visible, onClose, onSelectCity, onUseCurrentLocation }) => {
  const cities = ['Bizerte', 'Tunis', 'Nabeul', 'Sousse', 'Sfax'];

  const handleCitySelect = (city) => {
    onSelectCity(city);
    onClose();
  };

  const handleCurrentLocation = () => {
    onUseCurrentLocation();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select your city</Text>
          
          {cities.map((city) => (
            <Pressable 
              key={city} 
              onPress={() => handleCitySelect(city)}
              style={styles.cityButton}
            >
              <Text style={styles.cityText}>{city}</Text>
            </Pressable>
          ))}
          
          <Pressable 
            onPress={handleCurrentLocation}
            style={styles.currentLocationButton}
          >
            <Text style={styles.currentLocationText}>
              Use my current location
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPickerModal;