import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE } from '../config';
import axios from 'axios';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const { amount, eventId } = route.params;

  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log('Starting payment process...');
      console.log('Amount:', amount);
      console.log('Event ID:', eventId);
      
      // Create payment intent
      console.log('Creating payment intent...');
      const response = await axios.post(`${API_BASE}/payment`, {
        amount: amount, // Send amount in dollars
        currency: 'usd',
        eventId: eventId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      });

      console.log('Payment intent response:', response.data);
      const { client_secret, error } = response.data;
      
      if (error) {
        console.error('Payment intent error:', error);
        Alert.alert('Error', error.message);
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
        navigation.navigate('PaymentSuccess');
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
        Alert.alert('Error', err.response?.data?.message || err.message || 'An error occurred during payment.');
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