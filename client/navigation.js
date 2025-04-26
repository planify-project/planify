import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import WishlistScreen from './screens/WishlistScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Wishlist') {
              iconName = focused ? 'heart-circle' : 'heart-circle-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={30} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
            backgroundColor: '#fff',
            borderTopWidth: 0, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 }, 
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 15, // Android
          },
          headerShown: false,
          tabBarLabel: route.name === 'Home' ? 'Home' : '', 
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Wishlist" component={WishlistScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
