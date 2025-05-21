import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
function normalize(size) {
  const scale = width / 375;
  return Math.round(scale * size);
}

const CustomAlert = ({ 
  visible, 
  title, 
  message, 
  onClose, 
  type = 'info', // 'info', 'success', 'error', 'warning'
  buttons = [
    { text: 'OK', onPress: () => onClose() }
  ]
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#4CAF50' };
      case 'error':
        return { name: 'close-circle', color: '#FF3B30' };
      case 'warning':
        return { name: 'warning', color: '#FF9500' };
      default:
        return { name: 'information-circle', color: '#6C6FD1' };
    }
  };

  const icon = getIcon();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon.name} size={normalize(40)} color={icon.color} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style,
                  index === 0 && buttons.length > 1 ? styles.primaryButton : styles.secondaryButton
                ]}
                onPress={button.onPress}
              >
                <Text style={[
                  styles.buttonText,
                  index === 0 && buttons.length > 1 ? styles.primaryButtonText : styles.secondaryButtonText
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: normalize(24),
    padding: normalize(24),
    width: '90%',
    maxWidth: normalize(400),
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  iconContainer: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  title: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#2A2A3C',
    textAlign: 'center',
    marginBottom: normalize(12),
    letterSpacing: -0.3,
  },
  message: {
    fontSize: normalize(16),
    color: '#4A4A65',
    textAlign: 'center',
    marginBottom: normalize(24),
    lineHeight: normalize(24),
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(12),
  },
  button: {
    flex: 1,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(12),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: normalize(100),
  },
  primaryButton: {
    backgroundColor: '#6C6FD1',
    shadowColor: '#6C6FD1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: 'rgba(108, 111, 209, 0.1)',
  },
  buttonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#6C6FD1',
  },
});

export default CustomAlert; 