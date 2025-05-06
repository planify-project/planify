import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { normalize } from '../utils/scaling';

export default function HelpScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Help & Support</Text>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently Asked Questions</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            • How do I create an event?{'\n'}
            • How do I add services to my event?{'\n'}
            • How do I manage my schedule?{'\n'}
            • How do I update my profile?
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Support</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            If you need further assistance, please contact our support team:
          </Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}>
            <Text style={styles.buttonText}>Email Support</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Tutorials</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            Check out our video tutorials to learn more about using Planify:
          </Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}>
            <Text style={styles.buttonText}>Watch Tutorials</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: normalize(20),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  section: {
    padding: normalize(15),
    borderRadius: normalize(10),
    marginBottom: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(10),
  },
  text: {
    fontSize: normalize(16),
    lineHeight: normalize(24),
    marginBottom: normalize(15),
  },
  button: {
    padding: normalize(15),
    borderRadius: normalize(8),
    alignItems: 'center',
    marginTop: normalize(10),
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
}); 