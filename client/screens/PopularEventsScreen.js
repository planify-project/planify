// screens/PopularEventsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function PopularEventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Popular Events</Text>
      {/* You can map through popular events here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: normalize(24), fontWeight: 'bold' }
});
