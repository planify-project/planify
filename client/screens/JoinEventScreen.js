import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../components/CustomAlert';

export default function JoinEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [attendees, setAttendees] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [scale] = useState(new Animated.Value(0));
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'error'
  });

  const validateFields = () => {
    if (!name.trim()) {
      setAlertConfig({
        title: 'Name Required',
        message: 'Please enter your full name to continue.',
        type: 'error'
      });
      setAlertVisible(true);
      return false;
    }
    if (!email.trim()) {
      setAlertConfig({
        title: 'Email Required',
        message: 'Please enter your email address to continue.',
        type: 'error'
      });
      setAlertVisible(true);
      return false;
    }
    if (!phone.trim()) {
      setAlertConfig({
        title: 'Phone Number Required',
        message: 'Please enter your phone number to continue.',
        type: 'error'
      });
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    // Reset form fields
    setAttendees(1);
    setName('');
    setEmail('');
    setPhone('');
    setShowModal(false);
    navigation.navigate('Root', { screen: 'Home' });
  };

  const handleRegistration = () => {
    if (validateFields()) {
      setShowModal(true);
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      }).start();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.eventHeader}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>Sat, Dec 24, 2023 • 7:00 PM</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.availableBadge}>
              <Ionicons name="people-outline" size={14} color="#6C6FD1" />
              <Text style={styles.availableSeats}>150 seats available</Text>
            </View>
          </View>
          <Text style={styles.price}>{event.price}/{event.per}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Registration Details</Text>
        
        {/* Number of Attendees */}
        <View style={styles.field}>
          <Text style={styles.label}>Number of Attendees</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity 
              style={[styles.counterBtn, attendees <= 1 && styles.counterBtnDisabled]}
              onPress={() => setAttendees(Math.max(1, attendees - 1))}
            >
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{attendees}</Text>
            <TouchableOpacity 
              style={styles.counterBtn}
              onPress={() => setAttendees(attendees + 1)}
            >
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.field}>
          <Text style={styles.label}>Your Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#6C6FD1" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#A0A0B9"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#6C6FD1" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor="#A0A0B9"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#6C6FD1" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#A0A0B9"
            />
          </View>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Event Price</Text>
          <Text style={styles.summaryValue}>{event.price}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Attendees</Text>
          <Text style={styles.summaryValue}>x{attendees}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{parseFloat(event.price) * attendees} DT</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={handleRegistration}
      >
        <Text style={styles.confirmButtonText}>Confirm Registration</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale }] }]}>
            <View style={styles.modalHeader}>
              <View style={[styles.successIcon, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="checkmark" size={60} color="#FFFFFF" />
              </View>
              <Text style={styles.modalTitle}>Booking Confirmed!</Text>
              <Text style={styles.modalSubtitle}>Your registration was successful</Text>
            </View>
            
            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Event</Text>
                <Text style={styles.detailValue}>{event.title}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>Dec 24, 2023 • 7:00 PM</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Attendees</Text>
                <Text style={styles.detailValue}>{attendees}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact</Text>
                <Text style={styles.detailValue}>{phone}</Text>
              </View>
              <View style={[styles.detailRow, styles.noBorder]}>
                <Text style={styles.detailLabel}>Total Amount</Text>
                <Text style={[styles.detailValue, styles.highlightValue]}>{parseFloat(event.price) * attendees} DT</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.doneButton, { backgroundColor: '#6C6FD1' }]}
              onPress={handleConfirm}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        close={() => setAlertVisible(false)}
        buttons={[
          {
            text: 'OK',
            onPress: () => setAlertVisible(false),
            style: 'primary'
          }
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  eventHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  eventImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 14,
    color: '#4A4A65',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  availableSeats: {
    fontSize: 12,
    color: '#6C6FD1',
    marginLeft: 4,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C6FD1',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#4A4A65',
    marginBottom: 10,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(108, 111, 209, 0.2)',
    borderRadius: 12,
    backgroundColor: '#FAFBFF',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#2A2A3C',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  counterBtn: {
    backgroundColor: '#6C6FD1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  counterBtnDisabled: {
    backgroundColor: 'rgba(108, 111, 209, 0.5)',
  },
  counterBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  counterText: {
    fontSize: 18,
    marginHorizontal: 20,
    fontWeight: '600',
    color: '#2A2A3C',
    minWidth: 30,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginTop: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#4A4A65',
  },
  summaryValue: {
    fontSize: 15,
    color: '#2A2A3C',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(108, 111, 209, 0.15)',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#2A2A3C',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    color: '#6C6FD1',
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#6C6FD1',
    margin: 16,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 30,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#4A4A65',
    textAlign: 'center',
  },
  bookingDetails: {
    width: '100%',
    backgroundColor: '#F8F9FF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 111, 209, 0.1)',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 15,
    color: '#4A4A65',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#2A2A3C',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  highlightValue: {
    color: '#6C6FD1',
    fontSize: 16,
    fontWeight: '700',
  },
  doneButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  }
});