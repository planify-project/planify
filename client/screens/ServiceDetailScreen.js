import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import api from '../configs/api';
import BookingModal from '../components/BookingModal';
import { useSocket } from '../context/SocketContext';
import { getAuth } from 'firebase/auth';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../configs/url';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'error'
  });
  const scrollY = new Animated.Value(0);

  // Animated values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0.8, 0.9, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const checkProvider = async () => {
      if (auth.currentUser) {
        try {
          const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
          if (userResponse.data.success) {
            const isUserProvider = service.provider.email === auth.currentUser.email;
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
        navigation.setParams({ refresh: true });
      }
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        navigation.setParams({ refresh: false });
        const fetchService = async () => {
          try {
            const response = await api.get(`/services/${service.id}`);
            if (response.data.success) {
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
    navigation.navigate('Chat', { 
      serviceId: service.id,
      serviceProviderId: service.provider.id,
      serviceProviderName: service.provider.name,
      serviceProviderImage: service.provider.image_url
    });
  };

  const handleBooking = async () => {
    if (!auth.currentUser) {
      setAlertConfig({
        title: 'Authentication Required',
        message: 'You must be logged in to book a service',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    if (!selectedDate || !selectedSpace || !phoneNumber) {
      setAlertConfig({
        title: 'Required Fields Missing',
        message: 'Please fill in all required fields',
        type: 'error'
      });
      setAlertVisible(true);
      return;
    }

    try {
      setLoading(true);

      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      
      if (!userResponse.data.success) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;

      const bookingPayload = {
        userId: dbUserId,
        serviceId: service.id,
        date: new Date(selectedDate).toISOString(),
        location: selectedSpace,
        phone: phoneNumber,
        status: 'pending'
      };

      setShowBookingModal(false);

      const response = await api.post('/bookings', bookingPayload);

      if (response.data.success) {
        if (socket) {
          socket.emit('newBooking', {
            providerId: service.provider_id,
            bookingId: response.data.data.booking.id,
            customerId: auth.currentUser.uid,
            customerName: auth.currentUser.displayName || 'A customer',
            message: `New booking request for ${service.title}`
          });
        }

        setAlertConfig({
          title: 'Booking Request Sent',
          message: 'Your booking request has been sent. The service provider will be notified and can accept or reject your request.',
          type: 'success'
        });
        setAlertVisible(true);

        if (socket) {
          socket.on('bookingResponse', (data) => {
            if (data.notification.bookingId === response.data.data.booking.id) {
              setAlertConfig({
                title: 'Booking Update',
                message: data.notification.message,
                type: 'info'
              });
              setAlertVisible(true);
            }
          });
        }
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setAlertConfig({
        title: 'Booking Failed',
        message: error.response?.data?.message || error.message || 'Failed to create booking. Please try again.',
        type: 'error'
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('bookingResponse', (data) => {
        setAlertConfig({
          title: 'Booking Update',
          message: data.notification.message,
          type: 'info'
        });
        setAlertVisible(true);
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
          eventId: null,
          serviceId: service.id
        }
      })
    );
  };

  const renderDetailItem = (icon, label, value) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIconContainer}>
        {icon}
      </View>
      <View style={styles.detailContent}>
        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{value || 'Not specified'}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: imageUrl || 'https://picsum.photos/300/300' }}
          style={[styles.headerImage, { opacity: imageOpacity }]}
          onError={(e) => {
            console.error('Image loading error:', {
              serviceId: service.id,
              imageUrl: imageUrl,
              error: e.nativeEvent
            });
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.headerGradient}
        />
        
        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        {/* Animated Title */}
        <Animated.View 
          style={[
            styles.headerTitleContainer, 
            { 
              opacity: titleOpacity,
              transform: [{ scale: titleScale }]
            }
          ]}
        >
          <Text style={styles.headerTitle} numberOfLines={1}>
            {service.title}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>{service.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.primary }]}>{service.price} DT</Text>
            </View>
          </View>
          
          <View style={[styles.providerContainer, { backgroundColor: theme.card }]}>
            <Image 
              source={{ 
                uri: getImageUrl(service.provider.image_url) || 'https://picsum.photos/100/100'
              }} 
              style={styles.providerImage} 
            />
            <View style={styles.providerInfo}>
              <Text style={[styles.providerName, { color: theme.text }]}>
                {service.provider.name || 'Service Provider'}
              </Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name="star" 
                    size={16} 
                    color={star <= 4 ? "#FFD700" : "#D3D3D3"} 
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>4.0</Text>
              </View>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About this service</Text>
            <Text style={[styles.description, { color: theme.text }]}>{service.description}</Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Service Details</Text>
            
            {renderDetailItem(
              <MaterialCommunityIcons name="tag-outline" size={22} color={theme.primary} />,
              "Category",
              service.service_type
            )}
            
            {renderDetailItem(
              <Ionicons name="location-outline" size={22} color={theme.primary} />,
              "Location",
              service.location
            )}
            
            {renderDetailItem(
              <Ionicons name="time-outline" size={22} color={theme.primary} />,
              "Duration",
              "1 hour"
            )}
            
            {renderDetailItem(
              <FontAwesome5 name="calendar-check" size={20} color={theme.primary} />,
              "Availability",
              "Mon-Fri, 9AM-5PM"
            )}
          </View>

          <View style={styles.buttonContainer}>
            {isProvider ? (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.primary }]}
                  onPress={handleEdit}
                >
                  <Ionicons name="create-outline" size={22} color="#fff" />
                  <Text style={styles.buttonText}>Edit Service</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.error }]}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={22} color="#fff" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.primary }]}
                  onPress={() => setShowBookingModal(true)}
                >
                  <Ionicons name="calendar-outline" size={22} color="#fff" />
                  <Text style={styles.buttonText}>Book Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.secondary }]}
                  onPress={handleChat}
                >
                  <Ionicons name="chatbubble-outline" size={22} color="#fff" />
                  <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Animated.ScrollView>

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
            style: alertConfig.type === 'success' ? 'success' : 'primary'
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  headerTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  priceContainer: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 0.48,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});