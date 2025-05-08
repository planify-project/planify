import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../configs/api';

export default function EventDetail({ route, navigation }) {
  const { event } = route.params;
  const [service, setService] = useState(event);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event.id) {
      fetchServiceDetails();
    }
  }, [event.id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/services/${event.id}`);
      if (response.data.success) {
        setService(response.data.data);
      } else {
        setError('Failed to fetch service details');
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      if (error.code === 'ECONNREFUSED') {
        setError('Server is not running. Please start the server.');
      } else if (error.code === 'ETIMEDOUT') {
        setError('Request timed out. Please check your internet connection.');
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D5FEE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchServiceDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: service.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{service.name}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.location}>{service.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{service.rating}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{service.price} {service.currency}</Text>
          <Text style={styles.per}>/{service.per}</Text>
        </View>

        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.availableDates}>
          <Text style={styles.sectionTitle}>Available Dates</Text>
          <View style={styles.datesContainer}>
            {service.availableDates.map((date, index) => (
              <TouchableOpacity key={index} style={styles.dateButton}>
                <Text style={styles.dateText}>{date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const scale = width / 375;

function normalize(size) {
  return Math.round(scale * size);
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   image: {
//     width: '100%',
//     height: normalize(250),
//     resizeMode: 'cover'
//   },
//   content: {
//     padding: normalize(20)
//   },
//   title: {
//     fontSize: normalize(24),
//     fontWeight: 'bold',
//     marginBottom: normalize(10)
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(8)
//   },
//   location: {
//     marginLeft: normalize(8),
//     fontSize: normalize(14),
//     color: '#666'
//   },
//   rating: {
//     marginLeft: normalize(8),
//     fontSize: normalize(14),
//     color: '#666'
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     marginBottom: normalize(16)
//   },
//   price: {
//     fontSize: normalize(24),
//     fontWeight: 'bold',
//     color: '#5D5FEE'
//   },
//   per: {
//     fontSize: normalize(14),
//     color: '#666',
//     marginLeft: normalize(4)
//   },
//   description: {
//     fontSize: normalize(14),
//     color: '#666',
//     lineHeight: normalize(20),
//     marginBottom: normalize(20)
//   },
//   availableDates: {
//     marginBottom: normalize(20)
//   },
//   sectionTitle: {
//     fontSize: normalize(16),
//     fontWeight: 'bold',
//     marginBottom: normalize(10)
//   },
//   datesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: normalize(8)
//   },
//   dateButton: {
//     backgroundColor: '#f0f0f0',
//     paddingHorizontal: normalize(12),
//     paddingVertical: normalize(8),
//     borderRadius: normalize(8)
//   },
//   dateText: {
//     fontSize: normalize(14),
//     color: '#666'
//   },
//   bookButton: {
//     backgroundColor: '#5D5FEE',
//     padding: normalize(16),
//     borderRadius: normalize(8),
//     alignItems: 'center'
//   },
//   bookButtonText: {
//     color: '#fff',
//     fontSize: normalize(16),
//     fontWeight: 'bold'
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: normalize(20)
//   },
//   errorText: {
//     color: '#ff4444',
//     fontSize: normalize(14),
//     textAlign: 'center',
//     marginBottom: normalize(10)
//   },
//   retryButton: {
//     backgroundColor: '#5D5FEE',
//     paddingHorizontal: normalize(20),
//     paddingVertical: normalize(10),
//     borderRadius: normalize(8)
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: 'bold'
//   }
// }); 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  image: {
    width: '100%',
    height: normalize(250),
    resizeMode: 'cover',
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
  },
  content: {
    padding: normalize(20),
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    marginTop: -normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: normalize(12)
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(6)
  },
  location: {
    marginLeft: normalize(6),
    fontSize: normalize(14),
    color: '#777'
  },
  rating: {
    marginLeft: normalize(6),
    fontSize: normalize(14),
    color: '#777'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: normalize(12),
    marginBottom: normalize(16)
  },
  price: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: '#6C63FF'
  },
  per: {
    fontSize: normalize(14),
    color: '#777',
    marginLeft: normalize(4)
  },
  description: {
    fontSize: normalize(15),
    color: '#444',
    lineHeight: normalize(22),
    marginBottom: normalize(20)
  },
  availableDates: {
    marginBottom: normalize(20)
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: normalize(10)
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(10)
  },
  dateButton: {
    backgroundColor: '#EAEAFF',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderRadius: normalize(12),
    marginBottom: normalize(8)
  },
  dateText: {
    fontSize: normalize(14),
    color: '#5D5FEE',
    fontWeight: '600'
  },
  bookButton: {
    backgroundColor: '#5D5FEE',
    padding: normalize(16),
    borderRadius: normalize(12),
    alignItems: 'center',
    marginTop: normalize(10),
    shadowColor: '#5D5FEE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4
  },
  bookButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
    backgroundColor: '#fff'
  },
  errorText: {
    color: '#ff4444',
    fontSize: normalize(14),
    textAlign: 'center',
    marginBottom: normalize(10)
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
    borderRadius: normalize(10)
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
