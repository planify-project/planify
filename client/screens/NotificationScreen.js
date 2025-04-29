import React from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.message}>You have no notifications yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FC', padding: normalize(16) },
  title: { fontSize: normalize(24), fontWeight: 'bold', marginBottom: normalize(16), color: '#5D5FEE' },
  message: { fontSize: normalize(16), color: '#888' },
});