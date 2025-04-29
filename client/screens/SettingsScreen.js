import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Yonnefer Doe</Text>
          <Text style={styles.profileHandle}>@yonneferdoe</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="pencil" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="person-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>My Account</Text>
            <Text style={styles.rowSubtitle}>Make changes to your account</Text>
          </View>
          <MaterialIcons name="error-outline" size={18} color="#FF5A5F" style={{ marginRight: 8 }} />
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="people-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Saved Beneficiary</Text>
            <Text style={styles.rowSubtitle}>Manage your saved beneficiary</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <View style={styles.row}>
          <Ionicons name="moon-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Dark Mode</Text>
            <Text style={styles.rowSubtitle}>Change your theme to dark mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#5D5FEE" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#b3b3ff" }}
          />
        </View>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
            <Text style={styles.rowSubtitle}>Further secure your account for safety</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="log-out-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Log out</Text>
            <Text style={styles.rowSubtitle}>Log out of your account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="help-circle-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <Ionicons name="information-circle-outline" size={22} color="#5D5FEE" />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>About App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FC', paddingHorizontal: 0,     padding: normalize(16)
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b3b3c6',
    marginTop: 18,
    marginLeft: 18,
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: '#5D5FEE',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 18,
    padding: 18,
    marginBottom: 18,
    marginTop: 0,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16, borderWidth: 2, borderColor: '#fff' },
  profileName: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  profileHandle: { color: '#e0e0ff', fontSize: 14, marginTop: 2 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 18,
    paddingVertical: 4,
    paddingHorizontal: 0,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FC',
  },
  rowText: { flex: 1, marginLeft: 14 },
  rowTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  rowSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
});

