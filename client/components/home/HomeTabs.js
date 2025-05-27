import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { normalize } from '../../utils/scaling';
// import { navigationRef } from '../../navigationRef';

const HomeTabs = ({ activeTab, onTabPress, navigation }) => {
  const tabs = [
    { id: 'events', label: 'Events', screen: 'AllEvents' },
    { id: 'spaces', label: 'Event Spaces', screen: 'EventSpaces' },
    { id: 'services', label: 'Services', screen: 'AllServices' },
  ];

  const handleTabPress = (index, screen) => {
    onTabPress(index);
    if (screen === 'AllServices') {
      navigation.navigate('Services');
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity 
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          // onPress={() => handleTabPress(index, tab.screen)}
          onPress={() => handleTabPress(tab.id, tab.screen)}

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
    justifyContent: 'space-around',
    paddingVertical: normalize(16),
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    marginVertical: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(20),
  },
  activeTab: {
    backgroundColor: '#8d8ff3',
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
