import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const { amount, eventId, serviceId, registrationData } = route.params;
  const auth = getAuth();

  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log('Starting payment process...');
      console.log('Amount:', amount);
      console.log('Event ID:', eventId);
      console.log('Service ID:', serviceId);
      
      // Get user's database ID
      const userResponse = await api.get(`/users/firebase/${auth.currentUser.uid}`);
      if (!userResponse.data.success) {
        throw new Error('Failed to get user data');
      }
      const dbUserId = userResponse.data.data.id;
      
      // Create payment intent
      console.log('Creating payment intent...');
      const response = await api.post('/payment', {
        amount: amount,
        currency: 'usd',
        eventId: eventId,
        serviceId: serviceId,
        userId: dbUserId
      });

      console.log('Payment intent response:', response.data);
      const { client_secret, error } = response.data;
      
      if (error) {
        console.error('Payment intent error:', error);
        Alert.alert('Error', error);
        return;
      }

      if (!client_secret) {
        console.error('No client secret received');
        Alert.alert('Error', 'Payment intent not initialized. Please try again.');
        return;
      }

      // Confirm the payment
      console.log('Confirming payment...');
      const { error: confirmError } = await confirmPayment(client_secret, {
        paymentMethodType: 'Card',
      });
      
      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        navigation.navigate('PaymentFailure', { message: confirmError.message });
      } else {
        console.log('Payment successful!');
        
        // If this is an event registration, complete the registration
        if (eventId && registrationData) {
          try {
            // Register the user for the event
            await api.post('/events/register', {
              eventId,
              userId: dbUserId,
              ...registrationData
            });
          } catch (error) {
            console.error('Error completing registration:', error);
            Alert.alert('Warning', 'Payment successful but registration failed. Please contact support.');
          }
        }
        
        navigation.navigate('PaymentSuccess', { eventId });
      }
    } catch (err) {
      console.error('Payment error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.code === 'ECONNABORTED') {
        Alert.alert('Error', 'Request timed out. Please check your internet connection and try again.');
      } else if (!err.response) {
        Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 404) {
        Alert.alert('Error', 'Payment service not found. Please try again later.');
      } else if (err.response?.status === 500) {
        Alert.alert('Error', 'Server error. Please try again later.');
      } else {
        Alert.alert('Error', err.response?.data?.error || err.message || 'An error occurred during payment.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <Text style={styles.amount}>Amount: ${amount}</Text>
      
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#5D5FEE" />
      ) : (
        <TouchableOpacity 
          style={styles.button}
          onPress={handlePayment}
        >
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F7FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  amount: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardContainer: {
    height: 50,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  button: {
    backgroundColor: '#5D5FEE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen; 