import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { fetchAvailability, bookEventSpace } from '../configs/EventSpaceAPI';

export default function EventSpaceBookingForm({ space, user, onBooked }) {
  const [date, setDate] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [available, setAvailable] = useState(null);

  const checkAvailability = () => {
    fetchAvailability(space.id, date)
      .then(res => setAvailable(res.data.available))
      .catch(err => setAvailable(false));
  };

  const handleBook = () => {
    bookEventSpace({
      userId: user.id,
      spaceId: space.id,
      date,
      specialRequest,
    }).then(() => onBooked())
      .catch(err => alert('Booking failed'));
  };

  return (
    <View>
      <Text>Book {space.name}</Text>
      <TextInput placeholder="Date" value={date} onChangeText={setDate} />
      <Button title="Check Availability" onPress={checkAvailability} />
      {available !== null && (
        <Text>{available ? 'Available' : 'Not Available'}</Text>
      )}
      <TextInput
        placeholder="Special Requests"
        value={specialRequest}
        onChangeText={setSpecialRequest}
      />
      <Button title="Book" onPress={handleBook} disabled={!available} />
    </View>
  );
}