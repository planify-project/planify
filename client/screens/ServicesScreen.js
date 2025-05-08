import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [space, setSpace] = useState('');
  const [phone, setPhone] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupSuccess, setPopupSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${process.env.API_BASE || 'http://192.168.128.72:3000/api'}/services?type=service`);
      setServices(res.data.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      alert('Failed to fetch services. Please check your connection and try again.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(0, 0, 0, 0);
      setDate(newDate);
    }
  };

  const handleBook = async () => {
    if (!selectedService) {
      setPopupMessage('Please select a service first');
      setPopupSuccess(false);
      setPopupVisible(true);
      return;
    }
    if (!space || !date || !phone) {
      setPopupMessage('Please fill all fields');
      setPopupSuccess(false);
      setPopupVisible(true);
      return;
    }
    // Validate date is in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date < now) {
      setPopupMessage('Please select a future date');
      setPopupSuccess(false);
      setPopupVisible(true);
      return;
    }
    try {
      const bookingData = {
        user_id: 1, // This should come from your authentication system
        service_id: selectedService.id,
        event_id: "af1f2240-1a65-45d1-92e7-538dcacfe774",
        date: date.toISOString(),
        space,
        phone_number: phone,
      };
      const response = await axios.post(`${process.env.API_BASE || 'http://192.168.1.211:3000/api'}/bookings`, bookingData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        setBookingModalVisible(false);
        setPopupMessage('Booking submitted successfully!');
        setPopupSuccess(true);
        setPopupVisible(true);
        setSpace('');
        setPhone('');
        setDate(null);
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (err) {
      setPopupMessage(err.response?.data?.message || 'Failed to book service. Please try again.');
      setPopupSuccess(false);
      setPopupVisible(true);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Available Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.serviceName}>{item.description}</Text>
            <TouchableOpacity
              style={styles.reserveBtn}
              onPress={() => {
                setSelectedService(item);
                setBookingModalVisible(true);
              }}
            >
              <Text style={styles.reserveBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal visible={bookingModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book: {selectedService?.description}</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {date ? date.toLocaleDateString() : "Select a date"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Place</Text>
              <TextInput 
                placeholder="Enter event place" 
                style={styles.input} 
                value={space} 
                onChangeText={setSpace} 
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput 
                placeholder="Enter your phone number" 
                keyboardType="phone-pad" 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
              />
            </View>

            <TouchableOpacity 
              style={[styles.bookBtn, (!date || !space || !phone) && styles.bookBtnDisabled]} 
              onPress={handleBook} 
              disabled={!date || !space || !phone}
            >
              <Text style={styles.bookBtnText}>Confirm Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setBookingModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={popupVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', minWidth: 250 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: popupSuccess ? '#00B894' : '#FF3B30', marginBottom: 12 }}>
              {popupSuccess ? 'Success' : 'Error'}
            </Text>
            <Text style={{ fontSize: 16, color: '#333', marginBottom: 20, textAlign: 'center' }}>{popupMessage}</Text>
            <TouchableOpacity onPress={() => setPopupVisible(false)} style={{ backgroundColor: popupSuccess ? '#00B894' : '#FF3B30', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  details: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  reserveBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  reserveBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2C3E50',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  bookBtn: {
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  bookBtnDisabled: {
    backgroundColor: '#ccc',
  },
  bookBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
