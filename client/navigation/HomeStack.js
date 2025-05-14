function HomeStack() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { notifications } = useSocket();

  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#5D5FEE" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        })}
      />
      {/* ...other screens... */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});