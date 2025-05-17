import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE } from '../config';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const { amount, eventId } = route.params;

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create payment intent
      const response = await fetch(`${API_BASE}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          eventId: eventId
        }),
      });

      let clientSecret;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const { client_secret, error } = await response.json();
        if (error) {
          Alert.alert('Error', error.message);
          return;
        }
        clientSecret = client_secret;
      } else {
        const text = await response.text();
        console.error('Server response:', text);
        Alert.alert('Error', 'Invalid response from server. Check console for details.');
        return;
      }

      // Confirm the payment
      if (!clientSecret) {
        Alert.alert('Error', 'Payment intent not initialized. Please try again.');
        return;
      }
      const { error: confirmError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      
      if (confirmError) {
        navigation.navigate('PaymentFailure', { message: confirmError.message });
      } else {
        navigation.navigate('PaymentSuccess');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
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