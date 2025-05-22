import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { normalize } from '../utils/scaling';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from './CustomAlert';
import api from '../configs/api';

export default function EventSpaceBookingModal({ visible, onClose, onConfirm, loading, space }) {
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: new Date(),
    numberOfPeople: '',
    phoneNumber: '',
    message: '',
  });

  const [bookedDates, setBookedDates] = useState({});
  const eventTypes = [
    { label: 'Select Event Type', value: '' },
    { label: 'Wedding', value: 'wedding' },
    { label: 'Birthday', value: 'birthday' },
    { label: 'Conference', value: 'conference' },
    { label: 'Corporate Event', value: 'corporate' },
    { label: 'Graduation', value: 'graduation' },
    { label: 'Anniversary', value: 'anniversary' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    if (visible && space?.id) fetchBookedDates();
  }, [visible, space?.id]);

  const fetchBookedDates = async () => {
    try {
      const response = await api.get(`/event-spaces/${space.id}/bookings`);
      if (response?.data?.success) {
        const marked = {};
        response.data.data.forEach((booking) => {
          if (booking.status === 'confirmed') {
            const dateStr = new Date(booking.date).toISOString().split('T')[0];
            marked[dateStr] = {
              marked: true,
              dotColor: '#FF3B30',
              disabled: true,
              selected: false,
            };
          }
        });
        setBookedDates(marked);
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const handleDateSelect = (day) => {
    setFormData({ ...formData, eventDate: new Date(day.timestamp) });
  };

  const handleSubmit = () => {
    if (!formData.eventType)
      return Alert.alert('Error', 'Please select an event type');
    if (!formData.numberOfPeople)
      return Alert.alert('Error', 'Please select number of guests');
    if (!formData.phoneNumber)
      return Alert.alert('Error', 'Please enter your phone number');

    onConfirm({
      ...formData,
      date: formData.eventDate.toISOString().split('T')[0],
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book {space?.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          <ScrollView style={styles.formContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Event Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.eventType}
                    onValueChange={(val) => setFormData({ ...formData, eventType: val })}
                    style={styles.picker}
                  >
                    {eventTypes.map((type) => (
                      <Picker.Item key={type.value} label={type.label} value={type.value} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Event Date</Text>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    ...bookedDates,
                    [formData.eventDate.toISOString().split('T')[0]]: {
                      selected: true,
                      selectedColor: '#5D5FEE',
                    },
                  }}
                  minDate={new Date().toISOString().split('T')[0]}
                  theme={{ todayTextColor: '#5D5FEE', arrowColor: '#5D5FEE' }}
                  style={styles.calendar}
                />
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#5D5FEE' }]} />
                    <Text style={styles.legendText}>Selected</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                    <Text style={styles.legendText}>Booked</Text>
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of People</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.numberOfPeople}
                    onValueChange={(val) => setFormData({ ...formData, numberOfPeople: val })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select number of guests" value="" />
                    {[...Array(10)].map((_, i) => {
                      const num = (i + 1) * 10;
                      return <Picker.Item key={num} label={`${num} guests`} value={String(num)} />;
                    })}
                    <Picker.Item label="100+ guests" value="100+" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={[styles.input, styles.messageInput]}
                  placeholder="Any special requests or additional information"
                  multiline
                  numberOfLines={4}
                  value={formData.message}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Submitting...' : 'Submit Booking'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: normalize(16),
    width: '90%',
    maxHeight: '85%',
    padding: normalize(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: normalize(5),
  },
  closeButtonText: {
    fontSize: normalize(24),
    color: '#666',
  },
  formContainer: {
    maxHeight: '70%',
  },
  inputGroup: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: normalize(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    padding: normalize(12),
    fontSize: normalize(16),
    backgroundColor: '#FAFBFF',
    color: '#2A2A3C',
  },
  inputFocused: {
    borderColor: '#8D8FF3',
    backgroundColor: '#FFFFFF',
    shadowColor: '#8D8FF3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateContainer: {
    marginBottom: normalize(20),
    backgroundColor: '#f8f8f8',
  },
  messageInput: {
    height: normalize(100),
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(20),
  },
  button: {
    flex: 1,
    padding: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginHorizontal: normalize(8),
  },
  dateButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(141, 143, 243, 0.2)',
    borderRadius: normalize(14),
    padding: normalize(14),
    backgroundColor: '#FAFBFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: normalize(16),
    color: '#2A2A3C',
  },
  dateIcon: {
    marginLeft: normalize(8),
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#5D5FEE',
  },
  buttonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  picker: {
    height: normalize(50),
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#8D8FF3',
    borderRadius: normalize(16),
    padding: normalize(16),
  calendar: {
    borderRadius: normalize(8),
    marginBottom: normalize(8),
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: normalize(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(5),
  },
  legendDot: {
    width: normalize(10),
    height: normalize(10),
    borderRadius: 5,
    marginRight: normalize(4),
  },
  legendText: {
    fontSize: normalize(12),
    color: '#444',
  },
});
