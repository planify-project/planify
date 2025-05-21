import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../configs/api';
import BookingModal from '../components/BookingModal';
import { useSocket } from '../context/SocketContext';
import { getAuth } from 'firebase/auth';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../configs/url';

export default function ServiceDetailScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { service } = route.params;
  const { socket } = useSocket();
  const auth = getAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    const checkProvider = async () => {
      if (auth.currentUser) {
        try {
          const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
          if (userResponse.data.success) {
            // Use the provider information directly from the service object
            const isUserProvider = service.provider.email === auth.currentUser.email;
            console.log('Current user email:', auth.currentUser.email);
            console.log('Service provider email:', service.provider.email);
            console.log('Is provider:', isUserProvider);
            setIsProvider(isUserProvider);
          }
        } catch (error) {
          console.error('Error checking provider:', error);
        }
      }
    };
    checkProvider();
  }, [auth.currentUser, service.provider]);

  const imageUrl = getImageUrl(service.image_url);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/services/${service.id}`);
              Alert.alert('Success', 'Service deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate back and refresh the services list
                    navigation.navigate('AllServices', { refresh: true });
                  }
                }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service');
            }
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('EditService', { 
      service,
      onUpdate: () => {
        // Refresh the service details when returning from edit
        navigation.setParams({ refresh: true });
      }
    });
  };

  // Add refresh effect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        // Reset the refresh param
        navigation.setParams({ refresh: false });
        // Re-fetch the service data
        const fetchService = async () => {
          try {
            const response = await api.get(`/services/${service.id}`);
            if (response.data.success) {
              // Update the service data
              navigation.setParams({ service: response.data.data });
            }
          } catch (error) {
            console.error('Error refreshing service:', error);
          }
        };
        fetchService();
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.refresh]);

  const handleChat = () => {
    console.log('Chat button pressed');
    // navigation.dispatch(
    //   CommonActions.navigate({
    //     name: 'Root',
    //     params: {
    //       screen: 'AllEvents',
    //       params: {
    //         serviceId: service.id,
    //         serviceProviderId: service.provider.id,
    //         serviceProviderName: service.provider.name,
    //         serviceProviderImage: service.provider.image_url
    //       }
    //     }
    //   })
    // );
    navigation.navigate('Chat', { 
      serviceId: service.id,
      serviceProviderId: service.provider.id,
      serviceProviderName: service.provider.name,
      serviceProviderImage: service.provider.image_url
    });

  };

  const handleBooking = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to book a service');
      return;
    }

    // Validate required fields
    if (!selectedDate || !selectedSpace || !phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // First get the user's database ID
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      console.log('User response:', userResponse.data);
      
      if (!userResponse.data.success) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;
      console.log('Database user ID:', dbUserId);

      // Format the booking payload
      const bookingPayload = {
        userId: dbUserId,
        serviceId: service.id,
        date: new Date(selectedDate).toISOString(),
        location: selectedSpace,
        phone: phoneNumber,
        status: 'pending' // Add status field
      };

      console.log('Creating booking with payload:', bookingPayload);

      // Close the modal before making the request
      setShowBookingModal(false);

      const response = await api.post('/bookings', bookingPayload);

      console.log('Booking response:', response.data);

      if (response.data.success) {
        // Notify the service provider through socket
        if (socket) {
          console.log('Socket connected, emitting newBooking notification');
          console.log('Notification payload:', {
            providerId: service.provider_id,
            bookingId: response.data.data.booking.id,
            customerId: auth.currentUser.uid,
            customerName: auth.currentUser.displayName || 'A customer',
            message: `New booking request for ${service.title}`
          });
          
          socket.emit('newBooking', {
            providerId: service.provider_id,
            bookingId: response.data.data.booking.id,
            customerId: auth.currentUser.uid,
            customerName: auth.currentUser.displayName || 'A customer',
            message: `New booking request for ${service.title}`
          });
        } else {
          console.log('Socket not connected, cannot send notification');
        }

        Alert.alert(
          'Success',
          'Your booking request has been sent. The service provider will be notified and can accept or reject your request.',
          [{ text: 'OK' }]
        );

        // Listen for booking response
        if (socket) {
          socket.on('bookingResponse', (data) => {
            if (data.notification.bookingId === response.data.data.booking.id) {
              Alert.alert(
                'Booking Update',
                data.notification.message,
                [{ text: 'OK' }]
              );
            }
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Add socket listener for booking responses
  useEffect(() => {
    if (socket) {
      socket.on('bookingResponse', (data) => {
        Alert.alert(
          'Booking Update',
          data.notification.message,
          [{ text: 'OK' }]
        );
      });

      return () => {
        socket.off('bookingResponse');
      };
    }
  }, [socket]);

  const handlePayment = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Payment',
        params: {
          amount: service.price,
          eventId: null // or the appropriate event ID if needed
        }
      })
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={{ uri: imageUrl || 'https://picsum.photos/300/300' }}
        style={styles.serviceImage}
        onError={(e) => {
          console.error('Image loading error:', {
            serviceId: service.id,
            imageUrl: imageUrl,
            error: e.nativeEvent
          });
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{service.title}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>{service.price} DT</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.text }]}>{service.description}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Details</Text>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Category:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{service.service_type || 'Not specified'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Location:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{service.location || 'Not specified'}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isProvider ? (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleEdit}
              >
                <Ionicons name="create-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.error }]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={() => setShowBookingModal(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.secondary }]}
                onPress={handleChat}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBooking}
        service={service}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSpace={selectedSpace}
        setSelectedSpace={setSelectedSpace}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        loading={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  serviceImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  bookButton: {
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});