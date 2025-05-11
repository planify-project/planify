import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Privacy Policy</Text>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Information We Collect</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            We collect information that you provide directly to us, including:
            {'\n\n'}• Account information (name, email, phone number)
            {'\n'}• Event details and preferences
            {'\n'}• Service provider information
            {'\n'}• Payment information
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>How We Use Your Information</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            We use the information we collect to:
            {'\n\n'}• Provide and improve our services
            {'\n'}• Process your transactions
            {'\n'}• Send you important updates and notifications
            {'\n'}• Respond to your requests and questions
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Security</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Rights</Text>
          <Text style={[styles.text, { color: theme.text }]}>
            You have the right to:
            {'\n\n'}• Access your personal information
            {'\n'}• Correct inaccurate information
            {'\n'}• Request deletion of your information
            {'\n'}• Opt-out of marketing communications
          </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 