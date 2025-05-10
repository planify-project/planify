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
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});