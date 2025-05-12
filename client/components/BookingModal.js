import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

export default function BookingModal({ visible, onClose, onSubmit, service }) {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [space, setSpace] = useState('');
  const [phone, setPhone] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleConfirm = () => {
    // First check if all fields are filled
    if (!selectedDate || !space.trim() || !phone.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Just clean the phone number of any spaces
    const cleanPhone = phone.trim();

    // Submit with cleaned phone number
    onSubmit({
      date: selectedDate,
      space: space.trim(),
      phone_number: cleanPhone
    });
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Book Service</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Date Selection */}
            <Text style={[styles.label, { color: theme.text }]}>Select Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: theme.background }]}
              onPress={() => setShowCalendar(!showCalendar)}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.text} />
              <Text style={[styles.dateText, { color: theme.text }]}>
                {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Select a date'}
              </Text>
            </TouchableOpacity>

            {showCalendar && (
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: theme.primary }
                }}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  selectedDayBackgroundColor: theme.primary,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: theme.primary,
                  arrowColor: theme.primary,
                }}
                style={styles.calendar}
              />
            )}

            {/* Space/Venue Input */}
            <Text style={[styles.label, { color: theme.text }]}>Venue/Space</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Enter venue or space details"
              placeholderTextColor={theme.textSecondary}
              value={space}
              onChangeText={setSpace}
            />

            {/* Phone Input */}
            <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.error }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirm</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
  },
  calendar: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});