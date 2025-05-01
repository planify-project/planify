import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import EventCard from '../EventCard';
import { styles } from './styles';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

const PopularEvents = ({ navigation, events }) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Popular Events')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: normalize(250) }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {events.map((event, index) => (
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

export default PopularEvents;