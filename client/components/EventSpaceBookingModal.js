import React, { useState } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../utils/scaling';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from './CustomAlert';

export default function EventSpaceBookingModal({ 
  visible, 
  onClose, 
  onConfirm, 
  loading,
  space
}) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  const handleConfirm = () => {
    if (!phoneNumber || !startDate || !endDate) {
      setAlertConfig({
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    if (startDate >= endDate) {
      setAlertConfig({
        title: 'Invalid Dates',
        message: 'End date must be after start date',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    onConfirm({
      phoneNumber,
      startDate,
      endDate
    });
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Event Space</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
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

            <View style={styles.dateContainer}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text>{startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setStartDate(selectedDate);
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setEndDate(selectedDate);
                    }
                  }}
                  minimumDate={startDate}
                />
              )}
            </View>

            <TouchableOpacity 
              style={[styles.confirmButton, loading && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertVisible(false)}
      />
    </>
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
    backgroundColor: 'white',
    borderRadius: normalize(24),
    padding: normalize(24),
    width: '90%',
    maxWidth: 420,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(24),
    paddingBottom: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(141, 143, 243, 0.15)',
  },
  modalTitle: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#2A2A3C',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: 'rgba(141, 143, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: normalize(20),
  },
  label: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#4A4A65',
    marginBottom: normalize(8),
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(141, 143, 243, 0.2)',
    borderRadius: normalize(14),
    padding: normalize(14),
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
  },
  confirmButton: {
    backgroundColor: '#8D8FF3',
    borderRadius: normalize(16),
    padding: normalize(16),
    alignItems: 'center',
    marginTop: normalize(16),
    elevation: 4,
    shadowColor: '#8D8FF3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: normalize(17),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  spaceInfoContainer: {
    backgroundColor: 'rgba(141, 143, 243, 0.08)',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(24),
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(12),
    marginRight: normalize(12),
  },
  spaceInfoText: {
    flex: 1,
  },
  spaceName: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#2A2A3C',
    marginBottom: normalize(4),
  },
  spacePrice: {
    fontSize: normalize(14),
    color: '#8D8FF3',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(141, 143, 243, 0.15)',
    marginVertical: normalize(20),
  },
  bookingSummary: {
    backgroundColor: 'rgba(141, 143, 243, 0.08)',
    borderRadius: normalize(16),
    padding: normalize(16),
    marginTop: normalize(16),
    marginBottom: normalize(20),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  summaryLabel: {
    fontSize: normalize(14),
    color: '#4A4A65',
  },
  summaryValue: {
    fontSize: normalize(14),
    color: '#2A2A3C',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(8),
    paddingTop: normalize(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(141, 143, 243, 0.2)',
  },
  totalLabel: {
    fontSize: normalize(16),
    color: '#2A2A3C',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: normalize(18),
    color: '#8D8FF3',
    fontWeight: '700',
  },
  errorText: {
    color: '#FF3B5E',
    fontSize: normalize(14),
    marginTop: normalize(4),
    marginLeft: normalize(4),
  },
  loadingIndicator: {
    marginRight: normalize(8),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    right: normalize(14),
    color: '#8D8FF3',
  },
  phoneIcon: {
    position: 'absolute',
    left: normalize(14),
    top: normalize(14),
    color: '#8D8FF3',
  },
  inputWithIcon: {
    paddingLeft: normalize(40),
  },
});