import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import api from '../configs/api';
import { normalize } from '../utils/scaling';

export default function ScheduleScreen({ navigation, route }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const handleDelete = async (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/events/${eventId}`);
              // Remove the event from state
              setEvents(events.filter(event => event.id !== eventId));
              // Update calendar marks
              setMarkedDates(prev => {
                const newMarks = { ...prev };
                delete newMarks[selectedDate];
                return newMarks;
              });
              Alert.alert("Success", "Event deleted successfully");
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert("Error", "Failed to delete event");
            }
          }
        }
      ]
    );
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/events');
      
      if (response.data) {
        setEvents(response.data);
        
        // Create marked dates object with green background
        const marks = {};
        response.data.forEach(event => {
          const date = new Date(event.startDate).toISOString().split('T')[0];
          marks[date] = {
            selected: true,
            selectedColor: '#4CAF50', // Green color
            selectedTextColor: '#FFFFFF' // White text for contrast
          };
        });
        
        // Add current selected date marking if it exists
        if (selectedDate) {
          marks[selectedDate] = {
            ...marks[selectedDate],
            selected: true,
            selectedColor: '#4CAF50'
          };
        }
        
        setMarkedDates(marks);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (route.params?.newEvent) {
      setEvents(prevEvents => [route.params.newEvent, ...prevEvents]);
      if (route.params.selectedDate) {
        setSelectedDate(route.params.selectedDate);
        setMarkedDates(prev => ({
          ...prev,
          [route.params.selectedDate]: {
            selected: true,
            selectedColor: '#8d8ff3'
          }
        }));
      }
    }
  }, [route.params]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setMarkedDates(prev => ({
      ...prev,
      [day.dateString]: {
        selected: true,
        selectedColor: '#8d8ff3'
      }
    }));
  };

  const filteredEvents = selectedDate 
    ? events.filter(event => event.startDate.split('T')[0] === selectedDate)
    : events;

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={styles.calendar}
        theme={{
          selectedDayBackgroundColor: '#4CAF50',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#6C6FD1',
          arrowColor: '#6C6FD1',
        }}
        markingType="custom"
      />

      <View style={styles.eventsHeader}>
        <Text style={styles.myEventsText}>My Events</Text>
        <TouchableOpacity onPress={fetchEvents}>
          <Text style={styles.seeAllText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f78f1" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <TouchableOpacity 
                style={styles.eventInfo}
                onPress={() => navigation.navigate('EventDetails', { event: item })}
              >
                <Text style={styles.eventTitle}>{item.name}</Text>
                <Text style={styles.eventDate}>
                  {new Date(item.startDate).toLocaleDateString()}
                </Text>
                <Text style={styles.eventLocation}>
                  {item.venue?.name || 'No location set'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noEventsText}>No events scheduled</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FC',
    padding: 20,
    paddingTop: 24,
  },
  calendar: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  myEventsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C6FD1',
  },
  seeAllText: {
    color: '#6C6FD1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowRadius: normalize(4),
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  eventPrice: {
    color: '#6C6FD1',
    marginTop: normalize(2),
    fontWeight: 'bold',
    fontSize: normalize(13),
  },
  arrow: {
    fontSize: normalize(22),
    color: '#b3b3c6',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loader: {
    marginTop: 20
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20
  },
  noEventsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20
  },
  eventStatus: {
    fontSize: normalize(12),
    color: '#6C6FD1',
    marginTop: normalize(2)
  }
});