import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StripeProvider, useStripe, CardField } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('20'); // (or use your event's price)
  const [clientSecret, setClientSecret] = useState(null);
  const { confirmPayment, createPaymentMethod } = useStripe();

  const handlePayment = async () => {
    try {
      // 1. Call your backend (planify/server) endpoint to create a payment intent.
      const res = await fetch(`${Constants.expoConfig.extra.API_URL}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount, 10) * 100, currency: 'usd' }),
      });
      const { clientSecret: secret, error } = await res.json();
      if (error) {
         Alert.alert("Error", error);
         return;
      }
      setClientSecret(secret);

      // 2. (Optional) Create a payment method (e.g. via CardField) if you're using a custom UI.
      const { paymentMethod, error: pmError } = await createPaymentMethod({ type: 'card' });
      if (pmError) {
         Alert.alert("Payment Method Error", pmError.message);
         return;
      }

      // 3. Confirm the payment using the client secret (and payment method if available).
      const { error: confirmError } = await confirmPayment(clientSecret, { paymentMethod });
      if (confirmError) {
         Alert.alert("Payment Confirmation Error", confirmError.message);
      } else {
         Alert.alert("Success", "Payment completed successfully!");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <StripeProvider publishableKey={Constants.expoConfig.extra.STRIPE_PUBLISHABLE_KEY}>
      <View style={styles.container}>
        <Text style={styles.title}>Payment</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Amount (e.g. 20)"
          keyboardType="numeric"
        />
        <CardField
          postalCodeEnabled={false}
          style={styles.cardField}
        />
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#F6F7FB' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20, backgroundColor: '#fff' },
  cardField: { height: 50, marginVertical: 20, backgroundColor: '#fff' },
  button: { backgroundColor: '#4F7CAC', borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});

export default PaymentScreen; 