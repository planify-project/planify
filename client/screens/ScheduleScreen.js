import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import api from '../configs/api';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function ScheduleScreen({ navigation, route }) {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching events...');
      const response = await api.get('/events');
      console.log('Events response:', response.data);
      
      // The API returns data in { events: [...] } format
      if (response.data && Array.isArray(response.data.events)) {
        setEvents(response.data.events);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching events:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Listen for new events from CreateEventScreen
  useEffect(() => {
    if (route.params?.newEvent) {
      setEvents(prevEvents => [route.params.newEvent, ...prevEvents]);
    }
    if (route.params?.refresh) {
      fetchEvents();
    }
  }, [route.params]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem}
      onPress={() => navigation.navigate('/EventDetails', { event: item })}
    >
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.name || 'Untitled Event'}</Text>
        <Text style={styles.eventDate}>
          {new Date(item.date || item.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.eventStatus}>{item.status}</Text>
        <Text style={styles.eventPrice}>${parseFloat(item.budget || 0).toFixed(2)}</Text>
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
        <TouchableOpacity onPress={fetchEvents}>
          <Text style={styles.seeAllText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5D5FEE" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: normalize(20) }}
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
    padding: normalize(20),
    paddingTop: normalize(24),
  },
  calendar: {
    borderRadius: normalize(10),
    backgroundColor: '#fff',
    marginBottom: normalize(10),
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(20),
    marginBottom: normalize(10),
    alignItems: 'center',
  },
  myEventsText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#5D5FEE',
  },
  seeAllText: {
    color: '#5D5FEE',
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: normalize(12),
    marginBottom: normalize(12),
    borderRadius: normalize(12),
    alignItems: 'center',
    shadowColor: '#5D5FEE',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowRadius: normalize(4),
    elevation: 2,
  },
  eventImage: {
    width: normalize(80),
    height: normalize(60),
    borderRadius: normalize(8),
    marginRight: normalize(10),
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#222',
  },
  eventDate: {
    color: '#888',
    marginTop: normalize(2),
    fontSize: normalize(12),
  },
  eventPrice: {
    color: '#5D5FEE',
    marginTop: normalize(2),
    fontWeight: 'bold',
    fontSize: normalize(13),
  },
  arrow: {
    fontSize: normalize(22),
    color: '#b3b3c6',
  },
  loader: {
    marginTop: normalize(20)
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: normalize(20)
  },
  noEventsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: normalize(20)
  },
  eventStatus: {
    fontSize: normalize(12),
    color: '#5D5FEE',
    marginTop: normalize(2)
  }
});