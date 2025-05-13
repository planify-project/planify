import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useSocket } from '../context/SocketContext';

export default function EventSpaceNotification() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('eventSpaceBooked', (data) => {
      Alert.alert('New Booking', `Your space was booked by ${data.userName}`);
    });
    socket.on('eventSpaceBookingResponse', (data) => {
      Alert.alert('Booking Update', data.message);
    });
    return () => {
      socket.off('eventSpaceBooked');
      socket.off('eventSpaceBookingResponse');
    };
  }, [socket]);

  return null;
}