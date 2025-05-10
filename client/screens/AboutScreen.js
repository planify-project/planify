import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>About Planify</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Planify is a comprehensive event planning application designed to help users organize and manage their events efficiently. Our mission is to make event planning simple, enjoyable, and stress-free.
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Version: 1.0.0
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          © 2024 Planify. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
}); 