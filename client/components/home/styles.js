import { StyleSheet } from 'react-native';
import { normalize } from '../../utils/scaling';

export const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(20),
        marginBottom: normalize(10),
      },
      sectionTitle: {
        fontSize: normalize(18),
        fontWeight: 'bold',
      },
      seeAllText: {
        color: '#5D5FEE',
        fontSize: normalize(14),
      }
    ,
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: normalize(24),
        borderRadius: normalize(12),
        width: normalize(300)
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: normalize(18),
        marginBottom: normalize(16)
    },
    cityButton: {
        padding: normalize(12),
        borderRadius: normalize(8),
        marginVertical: normalize(4)
    },
    cityText: {
        fontSize: normalize(16)
    },
    currentLocationButton: {
        marginTop: normalize(16),
        padding: normalize(12),
        borderRadius: normalize(8)
    },
    currentLocationText: {
        color: '#5D5FEE',
        textAlign: 'center',
        fontSize: normalize(14)
    },
    container: {
        flex: 1,
        padding: normalize(16),
        backgroundColor: '#f9f9f9'
    },
    titleContainer: {
        marginTop: normalize(16),
        marginBottom: normalize(14),
    },
    title: {
        fontSize: normalize(21),
        fontWeight: 'bold',
        color: '#222',
        marginBottom: normalize(4),
    },
    subtitle: {
        fontSize: normalize(16),
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallText: {
        fontSize: normalize(12),
        color: 'gray',
    },
    locationText: {
        fontSize: normalize(16),
        fontWeight: 'bold',
        marginLeft: normalize(4),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationBtn: {
        backgroundColor: '#fff',
        padding: normalize(8),
        borderRadius: normalize(12),
        marginLeft: normalize(8),
    },
    button: {
        backgroundColor: '#5D5FEE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: normalize(12),
        borderRadius: normalize(8),
        marginVertical: normalize(16),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: normalize(16),
        fontWeight: 'bold',
        marginLeft: normalize(8),
    },
    tabs: {
        flexDirection: 'row',
        marginTop: normalize(20),
        marginBottom: normalize(10),
    },
    tab: {
        flex: 1,
        paddingVertical: normalize(12),
        backgroundColor: '#eee',
        marginHorizontal: normalize(5),
        borderRadius: normalize(10),
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#5D5FEE',
    },
    tabText: {
        marginTop: normalize(4),
        color: '#000',
        fontSize: normalize(14),
    },
    tabTextActive: {
        marginTop: normalize(4),
        color: '#fff',
        fontWeight: 'bold',
        fontSize: normalize(14),
    },
});