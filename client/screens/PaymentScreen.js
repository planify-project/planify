// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { useStripe, CardField } from '@stripe/stripe-react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { API_BASE } from '../config';
// import axios from 'axios';

// const PaymentScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { confirmPayment } = useStripe();
//   const [loading, setLoading] = useState(false);
//   const { amount, eventId } = route.params;

//   const handlePayment = async () => {
//     try {
//       setLoading(true);
//       console.log('Starting payment process...');
//       console.log('Amount:', amount);
//       console.log('Event ID:', eventId);
      
//       // Create payment intent
//       console.log('Creating payment intent...');
//       const response = await axios.post(`${API_BASE}/payment`, {
//         amount: amount, // Send amount in dollars
//         currency: 'usd',
//         eventId: eventId
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         timeout: 15000 // 15 second timeout
//       });

//       console.log('Payment intent response:', response.data);
//       const { client_secret, error } = response.data;
      
//       if (error) {
//         console.error('Payment intent error:', error);
//         Alert.alert('Error', error.message);
//         return;
//       }

//       if (!client_secret) {
//         console.error('No client secret received');
//         Alert.alert('Error', 'Payment intent not initialized. Please try again.');
//         return;
//       }

//       // Confirm the payment
//       console.log('Confirming payment...');
//       const { error: confirmError } = await confirmPayment(client_secret, {
//         paymentMethodType: 'Card',
//       });
      
//       if (confirmError) {
//         console.error('Payment confirmation error:', confirmError);
//         navigation.navigate('PaymentFailure', { message: confirmError.message });
//       } else {
//         console.log('Payment successful!');
//         navigation.navigate('PaymentSuccess');
//       }
//     } catch (err) {
//       console.error('Payment error details:', {
//         message: err.message,
//         code: err.code,
//         response: err.response?.data,
//         status: err.response?.status
//       });

//       if (err.code === 'ECONNABORTED') {
//         Alert.alert('Error', 'Request timed out. Please check your internet connection and try again.');
//       } else if (!err.response) {
//         Alert.alert('Error', 'Network error. Please check your internet connection and try again.');
//       } else if (err.response?.status === 404) {
//         Alert.alert('Error', 'Payment service not found. Please try again later.');
//       } else if (err.response?.status === 500) {
//         Alert.alert('Error', 'Server error. Please try again later.');
//       } else {
//         Alert.alert('Error', err.response?.data?.message || err.message || 'An error occurred during payment.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Payment Details</Text>
//       <Text style={styles.amount}>Amount: ${amount}</Text>
      
//       <CardField
//         postalCodeEnabled={false}
//         placeholder={{
//           number: '4242 4242 4242 4242',
//         }}
//         cardStyle={styles.card}
//         style={styles.cardContainer}
//       />
      
//       {loading ? (
//         <ActivityIndicator size="large" color="#6C6FD1" />
//       ) : (
//         <TouchableOpacity 
//           style={styles.button}
//           onPress={handlePayment}
//         >
//           <Text style={styles.buttonText}>Pay Now</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F6F7FB',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   amount: {
//     fontSize: 18,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   cardContainer: {
//     height: 50,
//     marginVertical: 20,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     textColor: '#000000',
//   },
//   button: {
//     backgroundColor: '#6C6FD1',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PaymentScreen; 

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE } from '../config';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Complete your payment to confirm your booking</Text>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>${amount}</Text>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.cardLabel}>Card Information</Text>
          <CardField
            postalCodeEnabled={false}
            placeholder={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={styles.card}
            style={styles.cardContainer}
          />
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={18} style={styles.securityIcon} />
          <Text style={styles.securityText}>Your payment information is secure and encrypted</Text>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.button}
          onPress={handlePayment}
        >
          <Text style={styles.buttonText}>Pay ${amount}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>Powered by</Text>
        <Text style={[styles.poweredByText, { fontWeight: '600' }]}>Stripe</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8F9FF',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'left',
    color: '#2A2A3C',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6E87',
    marginBottom: 8,
    textAlign: 'left',
  },
  paymentSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#8D8FF3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2A2A3C',
  },
  amountContainer: {
    backgroundColor: 'rgba(108, 111, 209, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
    color: '#4A4A65',
    fontWeight: '500',
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6C6FD1',
  },
  cardSection: {
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2A3C',
    marginBottom: 12,
  },
  cardContainer: {
    height: 56,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#2A2A3C',
    borderWidth: 1,
    borderColor: '#E0E0E6',
    borderRadius: 12,
    fontSize: 16,
    placeholderColor: '#A0A0B9',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  securityIcon: {
    marginRight: 8,
    color: '#6C6FD1',
  },
  securityText: {
    fontSize: 14,
    color: '#6E6E87',
  },
  button: {
    backgroundColor: '#6C6FD1',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  poweredByText: {
    fontSize: 14,
    color: '#6E6E87',
    marginRight: 8,
  },
  loadingContainer: {
    backgroundColor: '#6C6FD1',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default PaymentScreen;