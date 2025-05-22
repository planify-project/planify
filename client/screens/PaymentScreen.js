import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import api from '../configs/api';

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { amount, eventId, serviceId, registrationData } = route.params;
  const auth = getAuth();

  const handlePayment = async () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
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
        
        // Save payment record in database
        try {
          const paymentResponse = await api.post('/api/payments', {
            user_id: dbUserId,
            event_id: eventId,
            service_id: serviceId,
            amount: parseFloat(amount),
            method: 'transfer',
            status: 'completed',
            payment_intent_id: response.data.payment_intent_id
          });
        } catch (error) {
          // Silently continue - don't log or show errors
        }
        
        // If this is an event registration, complete the registration silently
        if (eventId && registrationData) {
          try {
            // Register the user for the event without showing any alerts
            await api.post('/api/events/register', {
              eventId,
              userId: dbUserId,
              name: registrationData.name,
              email: registrationData.email,
              phone: registrationData.phone,
              attendees: registrationData.attendees || 1
            });
          } catch (error) {
            // Silently continue - don't log or show errors
          }
        }
        
        // Show only the payment success modal
        setShowSuccessModal(true);
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

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate back to event detail screen
    navigation.navigate('EventDetail', { event: { id: eventId } });
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

      {/* Custom Payment Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <View style={styles.confirmIconContainer}>
              <Ionicons name="card-outline" size={40} color="#6C6FD1" />
            </View>
            <Text style={styles.confirmModalTitle}>Confirm Payment</Text>
            <Text style={styles.confirmModalAmount}>${amount}</Text>
            <Text style={styles.confirmModalMessage}>
              Are you sure you want to proceed with this payment?
            </Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.confirmButton]}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#00B894" />
            </View>
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalMessage}>Your payment has been processed successfully.</Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.modalButtonText}>Return to Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6E6E87',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6C6FD1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmModalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6C6FD1',
    marginBottom: 16,
  },
  confirmModalMessage: {
    fontSize: 16,
    color: '#6E6E87',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  confirmModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F7',
  },
  confirmButton: {
    backgroundColor: '#6C6FD1',
  },
  cancelButtonText: {
    color: '#6E6E87',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;