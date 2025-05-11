import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewScreen({ route }) {
  const { event } = route.params;
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah M.',
      date: 'Jan 15, 2024',
      rating: 5,
      title: 'Fantastic Experience!',
      text: 'The pool party exceeded all expectations. Great music, amazing atmosphere, and professional staff.',
      helpful: 12,
    },
    {
      id: 2,
      name: 'Michael R.',
      date: 'Jan 10, 2024',
      rating: 4,
      title: 'Good Time Overall',
      text: 'Really enjoyed the event. The location was perfect and the crowd was great.',
      helpful: 8,
    },
  ]);

  const handleRating = (value) => setRating(value);

  const handleSubmit = () => {
    if (!title || !comment || rating === 0) return;
    const newReview = {
      id: Date.now(),
      name: 'You',
      date: new Date().toDateString(),
      rating,
      title,
      text: comment,
      helpful: 0,
    };
    setReviews([newReview, ...reviews]);
    setTitle('');
    setComment('');
    setRating(0);
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
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{review.name.charAt(0)}</Text>
          </View>
          <View style={styles.reviewContent}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewer}>{review.name}</Text>
              <Text style={styles.date}>{review.date}</Text>
            </View>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name={i <= review.rating ? "star" : "star-outline"} size={16} color="#FFD700" />
              ))}
            </View>
            <Text style={styles.reviewTitle}>{review.title}</Text>
            <Text style={styles.reviewText}>{review.text}</Text>
            <View style={styles.reviewActions}>
              <Text style={styles.helpful}>{review.helpful} Helpful</Text>
              <TouchableOpacity><Text style={styles.report}>Report</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  subHeader: { fontSize: 16, marginBottom: 10 },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 12
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  addPhotoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  photoButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  photoText: { color: '#5D5FEE', fontWeight: '500' },
  optionalText: { marginLeft: 10, color: '#aaa', fontSize: 12 },
  submitButton: {
    backgroundColor: '#5D5FEE', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 30
  },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  reviewCard: { flexDirection: 'row', marginBottom: 20 },
  avatar: {
    backgroundColor: '#5D5FEE', width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginRight: 10
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  reviewContent: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewer: { fontWeight: '600' },
  date: { fontSize: 12, color: '#888' },
  starRow: { flexDirection: 'row', marginVertical: 5 },
  reviewTitle: { fontWeight: '600', marginBottom: 2 },
  reviewText: { color: '#333', marginBottom: 5 },
  reviewActions: { flexDirection: 'row', justifyContent: 'space-between' },
  helpful: { fontSize: 12, color: '#666' },
  report: { fontSize: 12, color: '#5D5FEE', fontWeight: '500' }
});
