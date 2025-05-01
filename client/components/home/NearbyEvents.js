import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import EventCard from '../EventCard';
import { styles } from './styles';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

const NearbyEvents = ({ navigation }) => {
  const nearbyEvents = [
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Pool party",
      location: "Les grottes, Bizerte",
      price: "20 DT",
      rating: "5.0",
      per: "person"
    },
    {
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02c5",
      title: "Golden Palace",
      location: "Cite Hasan, Nabeul",
      price: "175 DT",
      rating: "4.5",
      per: "night"
    }
  ];

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllEvents')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: normalize(250) }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nearbyEvents.map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              location={event.location}
              price={event.price}
              rating={event.rating}
              per={event.per}
              onPress={() => navigation.navigate('EventDetail', { event })}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default NearbyEvents;