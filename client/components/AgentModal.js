import React from 'react';
import { View, Text, Modal, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AgentModal = ({ visible, onClose, onChooseAgent }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Need Help Planning?</Text>
          <Image 
            // source={require('../assets/planning.png')}
            style={styles.modalImage}
          />
          <Text style={styles.modalText}>
            If you don't have an idea on how to plan an event, don't worry we've got you covered. For a small fee you can hire an agent of your choosing to help you plan
          </Text>
          <TouchableOpacity 
            style={styles.chooseAgentButton}
            onPress={onChooseAgent}
          >
            <Text style={styles.chooseAgentButtonText}>Choose Agent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24
  },
  chooseAgentButton: {
    backgroundColor: '#4f78f1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10
  },
  chooseAgentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%'
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default AgentModal;