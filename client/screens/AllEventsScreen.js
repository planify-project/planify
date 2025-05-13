// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View, Text, FlatList, Image, TouchableOpacity,
//   StyleSheet, Dimensions, ActivityIndicator, TextInput
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { API_BASE } from '../config';
// import { debounce } from 'lodash';

// const { width } = Dimensions.get('window');
// const scale = width / 375;
// function normalize(size) {
//   return Math.round(scale * size);
// }

// const API_ENDPOINT = `${API_BASE}/events/public`;

// export default function AllEventsScreen({ navigation }) {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const categories = ['All', 'Wedding', 'Birthday', 'Concert'];
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   const fetchEventsByCategory = async (category, query = '') => {
//     setLoading(true);
//     setSelectedCategory(category);

//     let url = `${API_ENDPOINT}?`;
//     if (category !== 'All') {
//       url += `type=${category}&`;
//     }
//     if (query.trim()) {
//       url += `search=${query.trim()}`;
//     }

//     try {
//       const response = await axios.get(url);
//       setEvents(response.data);
//       setError(null);
//     } catch (err) {
//       console.error("Error filtering events:", err.message);
//       setError("Could not load events");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const debouncedSearch = useCallback(
//     debounce((text) => {
//       fetchEventsByCategory(selectedCategory, text);
//     }, 500),
//     [selectedCategory]
//   );

//   const handleSearchChange = (text) => {
//     setSearchQuery(text);
//     debouncedSearch(text);
//   };

//   useEffect(() => {
//     fetchEventsByCategory(selectedCategory);
//   }, []);

//   const renderEventCard = ({ item }) => (
//     <View style={styles.card}>
//       <Image source={{ uri: item.coverImage }} style={styles.image} />
//       <View style={styles.cardContent}>
//         <View style={styles.tagContainer}>
//           <Text style={styles.tag}>{item.type || 'Public'}</Text>
//         </View>
//         <Text style={styles.title}>{item.name}</Text>
//         <View style={styles.infoRow}>
//           <Ionicons name="star" size={16} color="#FFD700" />
//           <Text style={styles.rating}>N/A</Text>
//           <Text style={styles.attendees}>{item.attendees_count || 0} attendees</Text>
//         </View>
//         <Text style={styles.location}>{item.location}</Text>
//         <View style={styles.footer}>
//           <Text style={styles.price}>
//             {item.is_free ? 'Free' : `${item.ticketPrice || 'N/A'} DT`}
//           </Text>
//           <TouchableOpacity
//             style={styles.detailsButton}
//             onPress={() => navigation.navigate('EventDetail', { event: item })}
//           >
//             <Text style={styles.detailsButtonText}>View Details</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4f78f1" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Search Bar */}
//       <View style={{ marginBottom: normalize(12) }}>
//         <View style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           backgroundColor: '#fff',
//           borderRadius: normalize(8),
//           paddingHorizontal: normalize(10),
//           paddingVertical: normalize(6),
//           shadowColor: '#000',
//           shadowOpacity: 0.05,
//           shadowRadius: 4,
//           elevation: 1
//         }}>
//           <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
//           <TextInput
//             style={{ flex: 1, fontSize: normalize(14) }}
//             placeholder="Search by name, location or date"
//             value={searchQuery}
//             onChangeText={handleSearchChange}
//           />
//         </View>
//       </View>

//       {/* Filter Buttons */}
//       <View style={styles.filterContainer}>
//         {categories.map((cat) => (
//           <TouchableOpacity
//             key={cat}
//             onPress={() => fetchEventsByCategory(cat, searchQuery)}
//             style={[
//               styles.filterButton,
//               selectedCategory === cat && styles.filterButtonActive
//             ]}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 selectedCategory === cat && styles.filterTextActive
//               ]}
//             >
//               {cat}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Event List */}
//       <FlatList
//         data={events}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderEventCard}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC', // very light background for freshness
//     padding: normalize(16),
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: normalize(8),
//     marginBottom: normalize(16),
//   },
//   filterButton: {
//     backgroundColor: '#E0E7FF',
//     paddingVertical: normalize(6),
//     paddingHorizontal: normalize(16),
//     borderRadius: normalize(20),
//   },
//   filterButtonActive: {
//     backgroundColor: '#4338CA',
//   },
//   filterText: {
//     color: '#4338CA',
//     fontWeight: '600',
//     fontSize: normalize(14),
//   },
//   filterTextActive: {
//     color: '#fff',
//   },
//   listContent: {
//     paddingBottom: normalize(30),
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: normalize(18),
//     marginBottom: normalize(20),
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: normalize(8),
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   image: {
//     width: '100%',
//     height: normalize(180),
//     borderTopLeftRadius: normalize(18),
//     borderTopRightRadius: normalize(18),
//   },
//   cardContent: {
//     padding: normalize(16),
//   },
//   tagContainer: {
//     position: 'absolute',
//     top: normalize(14),
//     left: normalize(14),
//     backgroundColor: '#4338CA',
//     borderRadius: normalize(6),
//     paddingHorizontal: normalize(10),
//     paddingVertical: normalize(4),
//     zIndex: 10,
//   },
//   tag: {
//     color: '#fff',
//     fontSize: normalize(11),
//     fontWeight: 'bold',
//   },
//   title: {
//     fontSize: normalize(20),
//     fontWeight: '700',
//     color: '#1E293B',
//     marginBottom: normalize(6),
//     textAlign: 'right',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: normalize(6),
//   },
//   rating: {
//     fontSize: normalize(14),
//     color: '#1E293B',
//     marginLeft: normalize(4),
//     marginRight: normalize(10),
//   },
//   attendees: {
//     fontSize: normalize(13),
//     color: '#64748B',
//   },
//   location: {
//     fontSize: normalize(13),
//     color: '#64748B',
//     marginBottom: normalize(10),
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   price: {
//     fontSize: normalize(16),
//     fontWeight: 'bold',
//     color: '#4338CA',
//   },
//   detailsButton: {
//     backgroundColor: '#EEF2FF',
//     borderRadius: normalize(12),
//     paddingHorizontal: normalize(14),
//     paddingVertical: normalize(8),
//   },
//   detailsButtonText: {
//     color: '#4338CA',
//     fontSize: normalize(14),
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#DC2626',
//     fontSize: normalize(16),
//     fontWeight: '500',
//   },
// });





import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Dimensions, ActivityIndicator, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import { debounce } from 'lodash';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const API_ENDPOINT = `${API_BASE}/events/public`;

export default function AllEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', 'Wedding', 'Birthday', 'Concert'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchEventsByCategory = async (category, query = '') => {
    setLoading(true);
    setSelectedCategory(category);

    let url = `${API_ENDPOINT}?`;
    if (category !== 'All') {
      url += `type=${category}&`;
    }
    if (query.trim()) {
      url += `search=${query.trim()}`;
    }

    try {
      const response = await axios.get(url);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Error filtering events:", err.message);
      setError("Could not load events");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      fetchEventsByCategory(selectedCategory, text);
    }, 500),
    [selectedCategory]
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    fetchEventsByCategory(selectedCategory);
  }, []);

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.coverImage }} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>{item.type || 'Public'}</Text>
        </View>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Text style={styles.rating}>N/A</Text>
          <Text style={styles.attendees}>{item.attendees_count || 0} attendees</Text>
        </View>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {item.is_free ? 'Free' : `${item.ticketPrice || 'N/A'} DT`}
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('EventDetail', { event: item })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f78f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={{ marginBottom: normalize(12) }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: normalize(8),
          paddingHorizontal: normalize(10),
          paddingVertical: normalize(6),
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1
        }}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: normalize(14) }}
            placeholder="Search by name, location or date"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => fetchEventsByCategory(cat, searchQuery)}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.filterButtonActive
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.filterTextActive
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: normalize(16),
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
    marginBottom: normalize(16),
  },
  filterButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(20),
  },
  filterButtonActive: {
    backgroundColor: '#4338CA',
  },
  filterText: {
    color: '#4338CA',
    fontWeight: '600',
    fontSize: normalize(14),
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: normalize(30),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: normalize(18),
    marginBottom: normalize(20),
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: normalize(8),
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: normalize(180),
    borderTopLeftRadius: normalize(18),
    borderTopRightRadius: normalize(18),
  },
  cardContent: {
    padding: normalize(16),
  },
  tagContainer: {
    position: 'absolute',
    top: normalize(14),
    left: normalize(14),
    backgroundColor: '#4338CA',
    borderRadius: normalize(6),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    zIndex: 10,
  },
  tag: {
    color: '#fff',
    fontSize: normalize(11),
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: normalize(4),
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(6),
  },
  rating: {
    fontSize: normalize(13),
    color: '#FBBF24',
    fontWeight: '500',
    marginLeft: normalize(4),
    marginRight: normalize(10),
  },
  attendees: {
    fontSize: normalize(13),
    color: '#475569',
    fontStyle: 'italic',
  },
  location: {
    fontSize: normalize(13),
    color: '#334155',
    marginTop: normalize(2),
    marginBottom: normalize(10),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#4338CA',
  },
  detailsButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(8),
  },
  detailsButtonText: {
    color: '#4338CA',
    fontSize: normalize(13),
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    fontSize: normalize(15),
    fontWeight: '500',
    textAlign: 'center',
  },
});
