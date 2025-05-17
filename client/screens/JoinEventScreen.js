import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JoinEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [attendees, setAttendees] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [scale] = useState(new Animated.Value(0));

  const handleConfirm = () => {
    // Reset form fields
    setAttendees(1);
    setName('');
    setEmail('');
    setPhone('');
    setShowModal(false);
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.eventHeader}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>Sat, Dec 24, 2023 • 7:00 PM</Text>
          <Text style={styles.availableSeats}>Available Seats: 150</Text>
          <Text style={styles.price}>{event.price}/{event.per}</Text>
        </View>
      </View>

      <View style={styles.form}>
        {/* Number of Attendees */}
        <View style={styles.field}>
          <Text style={styles.label}>Number of Attendees</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity 
              style={styles.counterBtn}
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
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={() => {
          // Handle registration confirmation
          setShowModal(true);
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true
          }).start();
        }}
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
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              </View>
              <Text style={styles.modalTitle}>Booking Confirmed!</Text>
            </View>
            
            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Event</Text>
                <Text style={styles.detailValue}>{event.title}</Text>
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
            </View>

            <TouchableOpacity 
              style={styles.doneButton}
              onPress={handleConfirm}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  eventHeader: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  availableSeats: {
    fontSize: 14,
    color: '#5D5FEE',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D5FEE',
    marginTop: 2,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    backgroundColor: '#5D5FEE',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  confirmButton: {
    backgroundColor: '#5D5FEE',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#E8F5E9',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E3033',
    marginBottom: 5,
  },
  bookingDetails: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  detailLabel: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#2E3033',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  doneButton: {
    backgroundColor: '#5D5FEE',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});