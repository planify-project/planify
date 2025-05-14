import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { normalize } from '../../utils/scaling';

const HomeTabs = ({ activeTab, onTabPress, navigation }) => {
  const tabs = [
    { id: 'events', label: 'Events', screen: 'AllEvents' },
    { id: 'spaces', label: 'Event Spaces', screen: 'EventSpaces' },
    { id: 'services', label: 'Services', screen: 'AllServices' },
  ];

  const handleTabPress = (index) => {
    onTabPress(index);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity 
          key={tab.id}
          style={[styles.tab, activeTab === index && styles.activeTab]}
          onPress={() => handleTabPress(index)}
        >
          <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: normalize(16),
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    padding: normalize(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: normalize(8),
    alignItems: 'center',
    borderRadius: normalize(6),
  },
  activeTab: {
    backgroundColor: '#5D5FEE',
  },
  tabText: {
    fontSize: normalize(14),
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default HomeTabs;