import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function NotificationScreen() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    serviceUpdates: true,
    promotional: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Notification Settings</Text>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Event Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: theme.text }]}>Event Reminders</Text>
            <Switch
              value={notifications.eventReminders}
              onValueChange={() => toggleNotification('eventReminders')}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={notifications.eventReminders ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: theme.text }]}>Service Updates</Text>
            <Switch
              value={notifications.serviceUpdates}
              onValueChange={() => toggleNotification('serviceUpdates')}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={notifications.serviceUpdates ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Marketing Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: theme.text }]}>Promotional Offers</Text>
            <Switch
              value={notifications.promotional}
              onValueChange={() => toggleNotification('promotional')}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={notifications.promotional ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notification Channels</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: theme.text }]}>Email Notifications</Text>
            <Switch
              value={notifications.emailNotifications}
              onValueChange={() => toggleNotification('emailNotifications')}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={notifications.emailNotifications ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
            <Switch
              value={notifications.pushNotifications}
              onValueChange={() => toggleNotification('pushNotifications')}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={notifications.pushNotifications ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#22223B',
    letterSpacing: 0.5,
  },
  section: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 18,
    color: '#4A4E69',
    letterSpacing: 0.2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F6',
  },
  settingText: {
    fontSize: 16,
    color: '#22223B',
    fontWeight: '500',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#4f78f1',
    shadowColor: '#4f78f1',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});