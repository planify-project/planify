// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { normalize } from '../../utils/scaling';
// import { styles } from './styles';

// const HomeTabs = ({ activeTab, onTabPress }) => {
//   const tabs = [
//     { id: 'event', icon: 'calendar-outline', label: 'Event' },
//     { id: 'space', icon: 'home-outline', label: 'Event space' },
//     { id: 'services', icon: 'construct-outline', label: 'Services' }
//   ];

//   return (
//     <View style={styles.tabs}>
//       {tabs.map(tab => (
//         <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.activeTab]} onPress={() => onTabPress(tab.id)}>
//           <Ionicons name={tab.icon} size={20} color={activeTab === tab.id ? '#fff' : '#000'} />
//           <Text style={[ styles.tabText, activeTab === tab.id && styles.tabTextActive]}> {tab.label}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// export default HomeTabs;
// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { normalize } from '../../utils/scaling';
// import { styles } from './styles';


// const HomeTabs = ({ activeTab, onTabPress, navigation }) => {
//   const tabs = [
//     { id: 'event', icon: 'calendar-outline', label: 'Event' },
//     { id: 'space', icon: 'home-outline', label: 'Event space' },
//     { id: 'services', icon: 'construct-outline', label: 'Services' },
//   ];

//   const handleTabPress = (tabId) => {
//     onTabPress(tabId);
//     if (tabId === 'event') {
//       navigation.navigate('AllEvents'); // Navigate to AllEventsScreen when "Event" is clicked
//     }
//   };

//   return (
//     <View style={styles.tabs}>
//       {tabs.map((tab) => (
//         <TouchableOpacity
//           key={tab.id}
//           style={[styles.tab, activeTab === tab.id && styles.activeTab]}
//           onPress={() => handleTabPress(tab.id)}
//         >
//           <Ionicons
//             name={tab.icon}
//             size={20}
//             color={activeTab === tab.id ? '#fff' : '#000'}
//           />
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === tab.id && styles.tabTextActive,
//             ]}
//           >
//             {tab.label}
//           </Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// export default HomeTabs;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { normalize } from '../../utils/scaling';

const HomeTabs = ({ activeTab, onTabPress, navigation }) => {
  const handleTabPress = (index) => {
    onTabPress(index);
    if (index === 1) { // When "Spaces" tab is pressed
      navigation?.navigate('EventSpaces');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 0 && styles.activeTab]}
        onPress={() => handleTabPress(0)}
      >
        <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
          Events
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 1 && styles.activeTab]}
        onPress={() => handleTabPress(1)}
      >
        <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
          Spaces
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 2 && styles.activeTab]}
        onPress={() => handleTabPress(2)}
      >
        <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
          Popular
        </Text>
      </TouchableOpacity>
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