import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

export default function BookingModal({ visible, onClose, onSubmit, service, isSubmitting }) {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [space, setSpace] = useState('');
  const [phone, setPhone] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const submissionLockRef = useRef(false);
  const lastSubmissionTimeRef = useRef(0);
  const SUBMISSION_COOLDOWN = 2000; // 2 seconds cooldown between submissions

  // Reset form and locks when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedDate('');
      setSpace('');
      setPhone('');
      setShowCalendar(false);
      setIsConfirming(false);
      submissionLockRef.current = false;
      lastSubmissionTimeRef.current = 0;
    }
  }, [visible]);

  // Prevent interaction while submitting
  useEffect(() => {
    if (isSubmitting) {
      submissionLockRef.current = true;
    } else {
      // Add a small delay before unlocking to prevent rapid re-submissions
      const timeout = setTimeout(() => {
        submissionLockRef.current = false;
      }, SUBMISSION_COOLDOWN);
      return () => clearTimeout(timeout);
    }
  }, [isSubmitting]);

  const handleDateSelect = (day) => {
    if (submissionLockRef.current) return;
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const handlePhoneChange = (text) => {
    if (submissionLockRef.current) return;
    // Only allow numbers and limit to 8 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 8);
    setPhone(cleaned);
  };

  const handleSpaceChange = (text) => {
    if (submissionLockRef.current) return;
    setSpace(text);
  };

  const handleConfirm = async () => {
    // Prevent multiple submissions
    if (submissionLockRef.current || isConfirming || isSubmitting) {
      console.log('Submission blocked - already in progress');
      return;
    }

    // Check cooldown
    const now = Date.now();
    if (now - lastSubmissionTimeRef.current < SUBMISSION_COOLDOWN) {
      console.log('Submission blocked - cooldown period');
      return;
    }

    // Validate phone number
    if (phone.length !== 8) {
      Alert.alert('Error', 'Phone number must be exactly 8 digits');
      return;
    }

    // Validate all fields
    if (!selectedDate || !space.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      console.log('Starting submission process...');
      submissionLockRef.current = true;
      setIsConfirming(true);
      lastSubmissionTimeRef.current = now;

      await onSubmit({
        date: selectedDate,
        space: space.trim(),
        phone_number: phone
      });
      
      console.log('Submission completed successfully');
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit booking. Please try again.');
    } finally {
      console.log('Cleaning up submission state...');
      setIsConfirming(false);
      // Keep the lock for a moment to prevent rapid re-submissions
      setTimeout(() => {
        submissionLockRef.current = false;
      }, SUBMISSION_COOLDOWN);
    }
  };

  const handleClose = () => {
    if (!submissionLockRef.current) {
      onClose();
    }
  };

  const renderContent = () => (
    <ScrollView>
      {/* Date Selection */}
      <Text style={[styles.label, { color: theme.text }]}>Select Date</Text>
      <TouchableOpacity
        style={[
          styles.dateButton, 
          { backgroundColor: theme.background },
          submissionLockRef.current && styles.disabledInput
        ]}
        onPress={() => !submissionLockRef.current && setShowCalendar(!showCalendar)}
        disabled={submissionLockRef.current}
      >
        <Ionicons name="calendar-outline" size={20} color={theme.text} />
        <Text style={[styles.dateText, { color: theme.text }]}>
          {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Select a date'}
        </Text>
      </TouchableOpacity>

      {showCalendar && !submissionLockRef.current && (
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
        style={[
          styles.input, 
          { backgroundColor: theme.background, color: theme.text },
          submissionLockRef.current && styles.disabledInput
        ]}
        placeholder="Enter venue or space details"
        placeholderTextColor={theme.textSecondary}
        value={space}
        onChangeText={handleSpaceChange}
        editable={!submissionLockRef.current}
      />

      {/* Phone Input */}
      <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
      <TextInput
        style={[
          styles.input, 
          { backgroundColor: theme.background, color: theme.text },
          submissionLockRef.current && styles.disabledInput
        ]}
        placeholder="Enter your phone number (8 digits)"
        placeholderTextColor={theme.textSecondary}
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        maxLength={8}
        editable={!submissionLockRef.current}
      />
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Book Service</Text>
            <TouchableOpacity onPress={handleClose} disabled={submissionLockRef.current}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {submissionLockRef.current || isSubmitting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.text }]}>
                Processing your booking...
              </Text>
            </View>
          ) : (
            renderContent()
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button, 
                { backgroundColor: theme.error },
                (submissionLockRef.current || isSubmitting) && styles.buttonDisabled
              ]}
              onPress={handleClose}
              disabled={submissionLockRef.current || isSubmitting}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button, 
                { backgroundColor: theme.primary },
                (submissionLockRef.current || isConfirming || isSubmitting) && styles.buttonDisabled
              ]}
              onPress={handleConfirm}
              disabled={submissionLockRef.current || isConfirming || isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isConfirming || isSubmitting ? 'Submitting...' : 'Confirm'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  disabledInput: {
    opacity: 0.6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});