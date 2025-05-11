import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

export default function ReviewScreen({ route, navigation }) {
  const { event } = route.params;
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test the API connection first
    testApiConnection();
    fetchReviews();
  }, []);

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await axios.get(`http://192.168.0.89:3000/api/reviews/event/${event.id}`);
      console.log('API test response:', response.data);
    } catch (error) {
      console.error('API test error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for event:', event.id);
      const response = await axios.get(`http://192.168.0.89:3000/api/reviews/event/${event.id}`);
      console.log('Reviews response:', response.data);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
      setLoading(false);
    }
  };

  const handleRating = (value) => setRating(value);

  const handleSubmit = async () => {
    if (!title || !comment || rating === 0) {
      Alert.alert('Error', 'Please fill in all fields and provide a rating');
      return;
    }

    try {
      const response = await axios.post(`http://192.168.0.89:3000/api/reviews`, {
        event_id: event.id, // Use the numeric ID
        rating,
        title,
        comment
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Review submitted successfully');
        setTitle('');
        setComment('');
        setRating(0);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Write a Review</Text>
      
      <Text style={styles.subHeader}>Rate your experience</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
            <Ionicons name={star <= rating ? "star" : "star-outline"} size={28} color="#FFD700" />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Title of your review"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Write your experience here"
        value={comment}
        onChangeText={setComment}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <View style={styles.addPhotoContainer}>
        <TouchableOpacity style={styles.photoButton}>
          <Ionicons name="cloud-upload-outline" size={20} color="#5D5FEE" />
          <Text style={styles.photoText}>Add Photos</Text>
        </TouchableOpacity>
        <Text style={styles.optionalText}>Optional</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Review</Text>
      </TouchableOpacity>

      {/* Recent Reviews */}
      <Text style={styles.sectionTitle}>Recent Reviews</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading reviews...</Text>
      ) : reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>No reviews yet</Text>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{review.user?.first_name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.reviewContent}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewer}>
                  {review.user ? `${review.user.first_name} ${review.user.last_name}` : 'Anonymous'}
                </Text>
                <Text style={styles.date}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name={i <= review.rating ? "star" : "star-outline"} size={16} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.reviewTitle}>{review.title}</Text>
              <Text style={styles.reviewText}>{review.comment}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  subHeader: { fontSize: 16, marginBottom: 10 },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  addPhotoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  photoButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  photoText: { color: '#5D5FEE', fontWeight: '500' },
  optionalText: { marginLeft: 10, color: '#aaa', fontSize: 12 },
  submitButton: {
    backgroundColor: '#5D5FEE',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  reviewCard: { flexDirection: 'row', marginBottom: 20 },
  avatar: {
    backgroundColor: '#5D5FEE',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  reviewContent: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewer: { fontWeight: '600' },
  date: { fontSize: 12, color: '#888' },
  starRow: { flexDirection: 'row', marginVertical: 5 },
  reviewTitle: { fontWeight: '600', marginBottom: 2 },
  reviewText: { color: '#333', marginBottom: 5 },
  loadingText: { textAlign: 'center', color: '#666', marginTop: 20 },
  noReviewsText: { textAlign: 'center', color: '#666', marginTop: 20 }
});
