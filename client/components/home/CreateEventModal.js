import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';


const CreateEventModal = ({ 
  visible, 
  eventName, 
  selectedDate, 
  onClose, 
  onEventNameChange, 
  onDateSelect,
  onCreateEvent 
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Event</Text>
          
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Event name"
            value={eventName}
            onChangeText={onEventNameChange}
          />
          
          <Text style={styles.label}>SELECT DATE</Text>
          <Calendar
            onDayPress={onDateSelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#5D5FEE' }
            }}
            theme={{
              selectedDayBackgroundColor: '#5D5FEE',
              todayTextColor: '#5D5FEE',
              arrowColor: '#5D5FEE',
            }}
            style={styles.calendar}
          />
          
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateEvent}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onClose}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: 300
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  calendar: {
    borderRadius: 8,
    marginBottom: 16
  },
  createButton: {
    backgroundColor: '#5D5FEE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  cancelButton: {
    padding: 8
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center'
  }
});

export default CreateEventModal;

