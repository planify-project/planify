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
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const HomeTabs = ({ activeTab, onTabPress, navigation }) => {
  const tabs = [
    { id: 'event', icon: 'calendar-outline', label: 'Event' },
    { id: 'space', icon: 'home-outline', label: 'Event space' },
    { id: 'services', icon: 'construct-outline', label: 'Services' },
  ];

  const handleTabPress = (tabId) => {
    onTabPress(tabId);
    if (tabId === 'event') {
      navigation.navigate('AllEvents');
    } else if (tabId === 'services') {
      navigation.navigate('AllServices');
    }
  };

  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => handleTabPress(tab.id)}
        >
          <Ionicons
            name={tab.icon}
            size={20}
            color={activeTab === tab.id ? '#fff' : '#000'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HomeTabs;