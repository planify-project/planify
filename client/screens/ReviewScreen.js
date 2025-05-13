import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
// import { API_URL } from '../config';
import { API_BASE } from '../config';

const API_ENDPOINT = `${API_BASE}/reviews/event`;

export default function ReviewScreen({ route, navigation }) {
  const { event } = route.params;
  // console.log("🛖🛖🛖",event);
  
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
      const response = await axios.get(`${API_ENDPOINT}/${event.id}`);
      // const response = await axios.get(`${API_ENDPOINT}/2`);
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
      const response = await axios.get(`${API_ENDPOINT}/${event.id}`);
      // const response = await axios.get(`${API_ENDPOINT}/2`);
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
          <Ionicons name="cloud-upload-outline" size={20} color="#4f78f1" />
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
                  {review.user ? `${review.user.name}` : 'Anonymous'}
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
  container: {
    padding: 20,
    backgroundColor: '#F7F8FA',
    minHeight: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#22223B',
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 16,
    color: '#4A4E69',
    marginBottom: 18,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  input: {
  borderWidth: 1.5,
  borderColor: '#4f78f1',
  backgroundColor: '#F0F4FF',
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
  fontSize: 15,
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 2,
},
textArea: {
  height: 110,
  textAlignVertical: 'top',
  borderWidth: 1.5,
  borderColor: '#4f78f1',
  backgroundColor: '#F0F4FF',
},
  addPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  photoText: {
    color: '#4f78f1',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 15,
  },
  optionalText: {
    color: '#A0A3BD',
    fontSize: 13,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#4f78f1',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#4f78f1',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 18,
    color: '#22223B',
    marginTop: 10,
  },
  reviewCard: {
    flexDirection: 'row',
    marginBottom: 22,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#4f78f1',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#4f78f1',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  reviewer: {
    fontWeight: '600',
    color: '#22223B',
    fontSize: 15,
  },
  date: {
    fontSize: 12,
    color: '#A0A3BD',
    fontWeight: '500',
  },
  starRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  reviewTitle: {
    fontWeight: '700',
    marginBottom: 2,
    color: '#4A4E69',
    fontSize: 15,
  },
  reviewText: {
    color: '#333',
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#A0A3BD',
    marginTop: 24,
    fontSize: 15,
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#A0A3BD',
    marginTop: 24,
    fontSize: 15,
  },
});
