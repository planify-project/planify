import React, { useState } from 'react';
import { Modal, View, Text, Button } from 'react-native';
import EventSpaceBookingForm from './EventSpaceBookingForm';

export default function EventSpaceModal({ space, onClose, navigation }) {
  const [booked, setBooked] = useState(false);

  return (
    <Modal visible={!!space} animationType="slide" onRequestClose={onClose}>
      <View>
        <Text>{space.name} - {space.location}</Text>
        {!booked ? (
          <EventSpaceBookingForm
            space={space}
            user={{ id: 1 }} // Replace with real user data
            onBooked={() => setBooked(true)}
          />
        ) : (
          <View>
            <Text>Booking Confirmed!</Text>
            <Button title="Close" onPress={onClose} />
          </View>
        )}
      </View>
    </Modal>
  );
}