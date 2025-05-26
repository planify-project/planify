// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { Ionicons } from '@expo/vector-icons';
// import api from '../configs/api';
// import { normalize } from '../utils/scaling';

// export default function ScheduleScreen({ navigation, route }) {
//   const [events, setEvents] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate || '');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [markedDates, setMarkedDates] = useState({});

//   const handleDelete = async (eventId) => {
//     Alert.alert(
//       "Delete Event",
//       "Are you sure you want to delete this event?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await api.delete(`/events/${eventId}`);
//               // Remove the event from state
//               setEvents(events.filter(event => event.id !== eventId));
//               // Update calendar marks
//               setMarkedDates(prev => {
//                 const newMarks = { ...prev };
//                 delete newMarks[selectedDate];
//                 return newMarks;
//               });
//               Alert.alert("Success", "Event deleted successfully");
//             } catch (error) {
//               console.error('Error deleting event:', error);
//               Alert.alert("Error", "Failed to delete event");
//             }
//           }
//         }
//       ]
//     );
//   };

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.get('/events');
      
//       if (response.data) {
//         setEvents(response.data);
        
//         // Create marked dates object with green background
//         const marks = {};
//         response.data.forEach(event => {
//           const date = new Date(event.startDate).toISOString().split('T')[0];
//           marks[date] = {
//             selected: true,
//             selectedColor: '#4CAF50', // Green color
//             selectedTextColor: '#FFFFFF' // White text for contrast
//           };
//         });
        
//         // Add current selected date marking if it exists
//         if (selectedDate) {
//           marks[selectedDate] = {
//             ...marks[selectedDate],
//             selected: true,
//             selectedColor: '#4CAF50'
//           };
//         }
        
//         setMarkedDates(marks);
//       }
//     } catch (err) {
//       console.error('Error fetching events:', err);
//       setError('Failed to load events. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     if (route.params?.newEvent) {
//       setEvents(prevEvents => [route.params.newEvent, ...prevEvents]);
//       if (route.params.selectedDate) {
//         setSelectedDate(route.params.selectedDate);
//         setMarkedDates(prev => ({
//           ...prev,
//           [route.params.selectedDate]: {
//             selected: true,
//             selectedColor: '#8d8ff3'
//           }
//         }));
//       }
//     }
//   }, [route.params]);

//   const handleDayPress = (day) => {
//     setSelectedDate(day.dateString);
//     setMarkedDates(prev => ({
//       ...prev,
//       [day.dateString]: {
//         selected: true,
//         selectedColor: '#8d8ff3'
//       }
//     }));
//   };

//   const filteredEvents = selectedDate 
//     ? events.filter(event => event.startDate.split('T')[0] === selectedDate)
//     : events;

//   return (
//     <View style={styles.container}>
//       <Calendar
//         onDayPress={handleDayPress}
//         markedDates={markedDates}
//         style={styles.calendar}
//         theme={{
//           selectedDayBackgroundColor: '#4CAF50',
//           selectedDayTextColor: '#FFFFFF',
//           todayTextColor: '#6C6FD1',
//           arrowColor: '#6C6FD1',
//         }}
//         markingType="custom"
//       />

//       <View style={styles.eventsHeader}>
//         <Text style={styles.myEventsText}>My Events</Text>
//         <TouchableOpacity onPress={fetchEvents}>
//           <Text style={styles.seeAllText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#4f78f1" style={styles.loader} />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <FlatList
//           data={filteredEvents}
//           keyExtractor={item => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.eventItem}>
//               <TouchableOpacity 
//                 style={styles.eventInfo}
//                 onPress={() => navigation.navigate('EventDetails', { event: item })}
//               >
//                 <Text style={styles.eventTitle}>{item.name}</Text>
//                 <Text style={styles.eventDate}>
//                   {new Date(item.startDate).toLocaleDateString()}
//                 </Text>
//                 <Text style={styles.eventLocation}>
//                   {item.venue?.name || 'No location set'}
//                 </Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={styles.deleteButton}
//                 onPress={() => handleDelete(item.id)}
//               >
//                 <Ionicons name="trash-outline" size={24} color="#FF3B30" />
//               </TouchableOpacity>
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.noEventsText}>No events scheduled</Text>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F6FC',
//     padding: 20,
//     paddingTop: 24,
//   },
//   calendar: {
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   eventsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   myEventsText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#6C6FD1',
//   },
//   seeAllText: {
//     color: '#6C6FD1',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   eventItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 16,
//     marginVertical: 8,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#6C6FD1',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: normalize(2) },
//     shadowRadius: normalize(4),
//     justifyContent: 'space-between',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   eventInfo: {
//     flex: 1,
//   },
//   deleteButton: {
//     padding: 8,
//     marginLeft: 16,
//   },
//   eventTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#222',
//   },
//   eventDate: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   eventPrice: {
//     color: '#6C6FD1',
//     marginTop: normalize(2),
//     fontWeight: 'bold',
//     fontSize: normalize(13),
//   },
//   arrow: {
//     fontSize: normalize(22),
//     color: '#b3b3c6',
//   },
//   eventLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 2,
//   },
//   loader: {
//     marginTop: 20
//   },
//   errorText: {
//     color: '#FF3B30',
//     textAlign: 'center',
//     marginTop: 20
//   },
//   noEventsText: {
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20
//   },
//   eventStatus: {
//     fontSize: normalize(12),
//     color: '#6C6FD1',
//     marginTop: normalize(2)
//   }
// });

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
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <Text style={styles.headerSubtitle}>
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'All upcoming events'}
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          style={styles.calendar}
          theme={{
            calendarBackground: '#FFFFFF',
            textSectionTitleColor: '#6C6FD1',
            selectedDayBackgroundColor: '#6C6FD1',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#6C6FD1',
            dayTextColor: '#2A2A3C',
            textDisabledColor: '#BBBBC9',
            dotColor: '#6C6FD1',
            selectedDotColor: '#FFFFFF',
            arrowColor: '#6C6FD1',
            monthTextColor: '#2A2A3C',
            indicatorColor: '#6C6FD1',
            textDayFontWeight: '500',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
          markingType="custom"
        />
      </View>

      <View style={styles.eventsHeader}>
        <Text style={styles.myEventsText}>
          {selectedDate ? `Events on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'All Events'}
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchEvents}>
          <Ionicons name="refresh" size={18} color="#6C6FD1" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6C6FD1" style={styles.loader} />
          <Text style={styles.loadingText}>Loading your events...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={normalize(50)} color="#FF3B5E" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <View style={styles.eventDateIndicator}>
                <Text style={styles.eventDateDay}>
                  {new Date(item.startDate).getDate()}
                </Text>
                <Text style={styles.eventDateMonth}>
                  {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short' })}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.eventInfo}
                onPress={() => navigation.navigate('EventDetail', { event: item })}
              >
                <Text style={styles.eventTitle}>{item.name}</Text>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#6E6E87" style={styles.eventIcon} />
                  <Text style={styles.eventTime}>
                    {new Date(item.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={16} color="#6E6E87" style={styles.eventIcon} />
                  <Text style={styles.eventLocation}>
                    {item.venue?.name || 'No location set'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#FF3B5E" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={normalize(60)} color="#BBBBC9" />
              <Text style={styles.noEventsText}>No events scheduled</Text>
              <Text style={styles.noEventsSubtext}>
                {selectedDate ? 'Try selecting a different date' : 'Your schedule is clear'}
              </Text>
            </View>
          }
          contentContainerStyle={filteredEvents.length === 0 ? styles.emptyListContent : styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    padding: normalize(20),
  },
  headerContainer: {
    marginBottom: normalize(20),
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(6),
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: normalize(16),
    color: '#6E6E87',
    fontWeight: '500',
  },
  calendarContainer: {
    borderRadius: normalize(20),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: normalize(20),
  },
  calendar: {
    borderRadius: normalize(20),
    paddingBottom: normalize(10),
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(16),
    alignItems: 'center',
  },
  myEventsText: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#2A2A3C',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 111, 209, 0.08)',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(20),
  },
  refreshText: {
    color: '#6C6FD1',
    fontWeight: '600',
    fontSize: normalize(14),
    marginLeft: normalize(4),
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: normalize(16),
    marginBottom: normalize(12),
    borderRadius: normalize(16),
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  eventDateIndicator: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(12),
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(14),
  },
  eventDateDay: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#6C6FD1',
  },
  eventDateMonth: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: '#6C6FD1',
    textTransform: 'uppercase',
  },
  eventInfo: {
    flex: 1,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(4),
  },
  eventIcon: {
    marginRight: normalize(6),
  },
  deleteButton: {
    padding: normalize(10),
    marginLeft: normalize(10),
    backgroundColor: 'rgba(255, 59, 94, 0.08)',
    borderRadius: normalize(12),
    height: normalize(44),
    width: normalize(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: normalize(4),
  },
  eventTime: {
    fontSize: normalize(14),
    color: '#6E6E87',
  },
  eventLocation: {
    fontSize: normalize(14),
    color: '#6E6E87',
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: normalize(40),
  },
  loader: {
    marginBottom: normalize(16),
  },
  loadingText: {
    fontSize: normalize(16),
    color: '#6E6E87',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: normalize(40),
  },
  errorText: {
    color: '#FF3B5E',
    textAlign: 'center',
    fontSize: normalize(16),
    marginTop: normalize(16),
    marginBottom: normalize(20),
    maxWidth: '80%',
    lineHeight: normalize(22),
  },
  retryButton: {
    backgroundColor: '#6C6FD1',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(12),
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(40),
  },
  noEventsText: {
    textAlign: 'center',
    color: '#2A2A3C',
    fontSize: normalize(18),
    fontWeight: '600',
    marginTop: normalize(16),
    marginBottom: normalize(8),
  },
  noEventsSubtext: {
    textAlign: 'center',
    color: '#6E6E87',
    fontSize: normalize(15),
  },
  listContent: {
    paddingBottom: normalize(20),
  },
  emptyListContent: {
    flexGrow: 1,
  },
  eventStatus: {
    fontSize: normalize(12),
    color: '#6C6FD1',
    marginTop: normalize(2),
    fontWeight: '500',
  },
});