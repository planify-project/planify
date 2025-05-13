import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function JoinEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [attendees, setAttendees] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

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
          navigation.navigate('JoinEventConfirmation', {
            event,
            attendees,
            name,
            email,
            phone
          });
        }}
      >
        <Text style={styles.confirmButtonText}>Confirm Registration</Text>
      </TouchableOpacity>
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
    color: '#4f78f1',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f78f1',
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
    backgroundColor: '#4f78f1',
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
    backgroundColor: '#4f78f1',
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
});