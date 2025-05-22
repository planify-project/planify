import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
// import { API_URL } from '../config';
import { API_BASE } from '../config';
import CustomAlert from '../components/CustomAlert';

const API_ENDPOINT = `${API_BASE}/reviews/event`;

export default function ReviewScreen({ route, navigation }) {
  const { event } = route.params;
  console.log("🛖🛖🛖",event);
  
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'error'
  });

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
      setAlertConfig({
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please try again later.',
        type: 'error'
      });
      setAlertVisible(true);
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
      setAlertConfig({
        title: 'Error',
        message: 'Failed to load reviews. Please try again later.',
        type: 'error'
      });
      setAlertVisible(true);
      setLoading(false);
    }
  };

  const handleRating = (value) => setRating(value);

  const validateReview = () => {
    if (rating === 0) {
      setAlertConfig({
        title: 'Rating Required',
        message: 'Please select a rating for your review.',
        type: 'error'
      });
      setAlertVisible(true);
      return false;
    }
    if (!title.trim()) {
      setAlertConfig({
        title: 'Title Required',
        message: 'Please enter a title for your review.',
        type: 'error'
      });
      setAlertVisible(true);
      return false;
    }
    if (!comment.trim()) {
      setAlertConfig({
        title: 'Comment Required',
        message: 'Please write your review comment.',
        type: 'error'
      });
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateReview()) return;

    try {
      const response = await axios.post(`${API_BASE}/reviews/event`, {
        event_id: event.id,
        rating,
        title,
        comment
      });

      if (response.status === 201) {
        setAlertConfig({
          title: 'Success',
          message: 'Your review has been submitted successfully!',
          type: 'success'
        });
        setAlertVisible(true);
        setTitle('');
        setComment('');
        setRating(0);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setAlertConfig({
        title: 'Error',
        message: 'Failed to submit review. Please try again later.',
        type: 'error'
      });
      setAlertVisible(true);
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
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#F7F8FA',
//     minHeight: '100%',
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: '700',
//     marginBottom: 8,
//     color: '#22223B',
//     letterSpacing: 0.5,
//   },
//   subHeader: {
//     fontSize: 16,
//     color: '#4A4E69',
//     marginBottom: 18,
//     fontWeight: '500',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     alignSelf: 'flex-start',
//   },
//   input: {
//     borderWidth: 1.5,
//     borderColor: '#6C6FD1',
//     backgroundColor: '#F0F4FF',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//     fontSize: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.04,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   textArea: {
//     height: 110,
//     textAlignVertical: 'top',
//     borderWidth: 1.5,
//     borderColor: '#6C6FD1',
//     backgroundColor: '#F0F4FF',
//   },
//   addPhotoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 22,
//   },
//   photoButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EEF2FB',
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   photoText: {
//     color: '#6C6FD1',
//     fontWeight: '600',
//     marginLeft: 6,
//     fontSize: 15,
//   },
//   optionalText: {
//     color: '#A0A3BD',
//     fontSize: 13,
//     fontStyle: 'italic',
//   },
//   submitButton: {
//     backgroundColor: '#6C6FD1',
//     paddingVertical: 16,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginBottom: 32,
//     shadowColor: '#6C6FD1',
//     shadowOpacity: 0.18,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 12,
//     elevation: 3,
//   },
//   submitText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 17,
//     letterSpacing: 0.5,
//   },
//   sectionTitle: {
//     fontSize: 19,
//     fontWeight: '700',
//     marginBottom: 18,
//     color: '#22223B',
//     marginTop: 10,
//   },
//   reviewCard: {
//     flexDirection: 'row',
//     marginBottom: 22,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   avatar: {
//     backgroundColor: '#6C6FD1',
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 14,
//     shadowColor: '#6C6FD1',
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   avatarText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 20,
//   },
//   reviewContent: {
//     flex: 1,
//   },
//   reviewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 2,
//   },
//   reviewer: {
//     fontWeight: '600',
//     color: '#22223B',
//     fontSize: 15,
//   },
//   date: {
//     fontSize: 12,
//     color: '#A0A3BD',
//     fontWeight: '500',
//   },
//   starRow: {
//     flexDirection: 'row',
//     marginVertical: 4,
//   },
//   reviewTitle: {
//     fontWeight: '700',
//     marginBottom: 2,
//     color: '#4A4E69',
//     fontSize: 15,
//   },
//   reviewText: {
//     color: '#333',
//     marginBottom: 5,
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   loadingText: {
//     textAlign: 'center',
//     color: '#A0A3BD',
//     marginTop: 24,
//     fontSize: 15,
//   },
//   noReviewsText: {
//     textAlign: 'center',
//     color: '#A0A3BD',
//     marginTop: 24,
//     fontSize: 15,
//   },
// });

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F8F9FF',
    minHeight: '100%',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2A2A3C',
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: 16,
    color: '#4A4A65',
    marginBottom: 20,
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(108, 111, 209, 0.25)',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
    color: '#2A2A3C',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
    marginBottom: 24,
  },
  addPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 111, 209, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginRight: 12,
  },
  photoText: {
    color: '#6C6FD1',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  optionalText: {
    color: '#8A8BB3',
    fontSize: 14,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#6C6FD1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2A2A3C',
    marginTop: 12,
    letterSpacing: -0.3,
  },
  reviewCard: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  avatar: {
    backgroundColor: '#6C6FD1',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  reviewer: {
    fontWeight: '700',
    color: '#2A2A3C',
    fontSize: 16,
  },
  date: {
    fontSize: 13,
    color: '#8A8BB3',
    fontWeight: '500',
  },
  starRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  reviewTitle: {
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 6,
    color: '#4A4A65',
    fontSize: 16,
  },
  reviewText: {
    color: '#4A4A65',
    marginBottom: 5,
    fontSize: 15,
    lineHeight: 22,
  },
  loadingText: {
    textAlign: 'center',
    color: '#8A8BB3',
    marginTop: 30,
    fontSize: 16,
    fontWeight: '500',
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#8A8BB3',
    marginTop: 30,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(108, 111, 209, 0.05)',
    padding: 20,
    borderRadius: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    marginVertical: 24,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A3C',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4A65',
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C6FD1',
    marginLeft: 12,
  },
  reviewsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewCount: {
    fontSize: 14,
    color: '#8A8BB3',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 111, 209, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  filterText: {
    color: '#6C6FD1',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  starIcon: {
    marginRight: 6,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFB800',
    marginLeft: 8,
  },
  photoPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  photoPreviewContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  inputFocused: {
    borderColor: '#6C6FD1',
    shadowColor: '#6C6FD1',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#8A8BB3',
    textAlign: 'right',
    marginTop: -12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B5E',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});