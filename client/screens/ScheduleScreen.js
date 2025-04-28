import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const events = [
  {
    id: '1',
    title: 'Pool party',
    date: '2025-07-19',
    price: '$260.7/night',
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: '2',
    title: 'Golden Palace Hotel',
    date: '2025-03-29',
    price: '$135.9/night',
    image: 'https://via.placeholder.com/100x80.png?text=Hotel',
  },
];

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.eventItem}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <Text style={styles.eventPrice}>{item.price}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#5D5FEE' },
        }}
        style={styles.calendar}
        theme={{
          selectedDayBackgroundColor: '#5D5FEE',
          todayTextColor: '#5D5FEE',
          arrowColor: '#5D5FEE',
        }}
      />
      <View style={styles.eventsHeader}>
        <Text style={styles.myEventsText}>My Events</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FC', padding: 20, paddingTop:24 },
  calendar: { borderRadius: 10, backgroundColor: '#fff', marginBottom: 10 },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  myEventsText: { fontSize: 18, fontWeight: 'bold', color: '#5D5FEE' },
  seeAllText: { color: '#5D5FEE', fontWeight: 'bold' },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#5D5FEE',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: { width: 80, height: 60, borderRadius: 8, marginRight: 10 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  eventDate: { color: '#888', marginTop: 2 },
  eventPrice: { color: '#5D5FEE', marginTop: 2, fontWeight: 'bold' },
  arrow: { fontSize: 22, color: '#b3b3c6' },
});
