const { Booking, Service, User, Event, Notification } = require('../database');

const createBooking = async (req, res) => {
  const { userId, serviceId, date, location, phone } = req.body;
  console.log('1. Received booking request:', { userId, serviceId, date, location, phone });

  try {
    // Get service and provider info
    const service = await Service.findByPk(serviceId, {
      include: [{ model: User, as: 'provider' }]
    });

    if (!service) {
      console.log('2. Service not found:', serviceId);
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    console.log('2. Found service:', { 
      id: service.id, 
      title: service.title, 
      provider_id: service.provider_id,
      provider_name: service.provider?.name 
    });

    // Get user info
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('3. User not found:', userId);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    console.log('3. Found user:', { id: user.id, name: user.name });

    // Create booking
    const booking = await Booking.create({
      userId,
      serviceId,
      date,
      location,
      phone,
      status: 'pending'
    });
    console.log('4. Created booking:', { 
      id: booking.id, 
      userId: booking.userId,
      serviceId: booking.serviceId,
      status: booking.status 
    });

    // Create notification for the service owner
    const ownerNotification = await Notification.create({
      user_id: service.provider_id,
      title: 'New Booking Request',
      message: `${user.name} wants to book your service "${service.title}" on ${new Date(date).toLocaleDateString()} at ${location}. Phone: ${phone}`,
      type: 'booking_request',
      booking_id: booking.id,
      is_read: false
    });
    console.log('5. Created owner notification:', { 
      id: ownerNotification.id, 
      user_id: ownerNotification.user_id,
      type: ownerNotification.type,
      message: ownerNotification.message
    });

    // Create notification for the booking user
    const userNotification = await Notification.create({
      user_id: userId,
      title: 'Booking Request Sent',
      message: `Your booking request for "${service.title}" has been sent to ${service.provider.name}.`,
      type: 'booking_request',
      booking_id: booking.id,
      is_read: false
    });
    console.log('6. Created user notification:', { 
      id: userNotification.id, 
      user_id: userNotification.user_id,
      type: userNotification.type,
      message: userNotification.message
    });

    // Send notifications via socket
    const io = req.app.get('io');
    const ownerRoom = `user_${service.provider_id}`;
    const userRoom = `user_${userId}`;

    console.log('7. Sending socket notifications to rooms:', {
      ownerRoom,
      userRoom,
      ownerSocketCount: io.sockets.adapter.rooms.get(ownerRoom)?.size || 0,
      userSocketCount: io.sockets.adapter.rooms.get(userRoom)?.size || 0
    });

    // Send to service provider
    io.to(ownerRoom).emit('newBooking', { 
      notification: {
        id: ownerNotification.id,
        title: ownerNotification.title,
        message: ownerNotification.message,
        type: ownerNotification.type,
        booking_id: ownerNotification.booking_id,
        createdAt: ownerNotification.created_at,
        booking: {
          id: booking.id,
          service: {
            id: service.id,
            title: service.title
          },
          user: {
            id: user.id,
            name: user.name
          }
        }
      }
    });

    // Send to booking user
    io.to(userRoom).emit('newBooking', { 
      notification: {
        id: userNotification.id,
        title: userNotification.title,
        message: userNotification.message,
        type: userNotification.type,
        booking_id: userNotification.booking_id,
        createdAt: userNotification.created_at,
        booking: {
          id: booking.id,
          service: {
            id: service.id,
            title: service.title
          },
          provider: {
            id: service.provider.id,
            name: service.provider.name
          }
        }
      }
    });

    console.log('8. Socket notifications sent');

    res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      data: { 
        booking, 
        ownerNotification,
        userNotification 
      }
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Service, attributes: ['id', 'title'] },
        { model: Event, attributes: ['id', 'title'] },
      ],
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Error getting booking' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.update(req.body);
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Error updating booking' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log('1. Deleting booking:', bookingId);

    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Service, include: [{ model: User, as: 'provider' }] },
        { model: User }
      ]
    });

    if (!booking) {
      console.log('2. Booking not found:', bookingId);
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    console.log('2. Found booking:', {
      id: booking.id,
      userId: booking.userId,
      serviceId: booking.serviceId,
      status: booking.status
    });

    // Create notifications for both users
    const notifications = await Promise.all([
      // Notification for service provider
      Notification.create({
        user_id: booking.Service.provider_id,
        title: 'Booking Cancelled',
        message: `${booking.User.name} has cancelled their booking for "${booking.Service.title}".`,
        type: 'booking_cancelled',
        booking_id: booking.id,
        is_read: false
      }),
      // Notification for booking user
      Notification.create({
        user_id: booking.userId,
        title: 'Booking Cancelled',
        message: `You have cancelled your booking for "${booking.Service.title}".`,
        type: 'booking_cancelled',
        booking_id: booking.id,
        is_read: false
      })
    ]);

    console.log('3. Created cancellation notifications');

    // Send socket notifications
    const io = req.app.get('io');
    io.to(`user_${booking.Service.provider_id}`).emit('bookingCancelled', {
      notification: {
        id: notifications[0].id,
        title: notifications[0].title,
        message: notifications[0].message,
        type: notifications[0].type,
        booking_id: notifications[0].booking_id,
        createdAt: notifications[0].created_at
      }
    });

    io.to(`user_${booking.userId}`).emit('bookingCancelled', {
      notification: {
        id: notifications[1].id,
        title: notifications[1].title,
        message: notifications[1].message,
        type: notifications[1].type,
        booking_id: notifications[1].booking_id,
        createdAt: notifications[1].created_at
      }
    });

    console.log('4. Sent socket notifications');

    // Delete the booking
    await booking.destroy();
    console.log('5. Deleted booking');

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: { notifications }
    });

  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: error.message
    });
  }
};

const respondToBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { response } = req.body; // 'accepted' or 'rejected'

  console.log('1. Responding to booking:', { bookingId, response });

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Service, include: [{ model: User, as: 'provider' }] },
        { model: User }
      ]
    });

    if (!booking) {
      console.log('2. Booking not found:', bookingId);
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    console.log('2. Found booking:', {
      id: booking.id,
      userId: booking.userId,
      serviceId: booking.serviceId,
      status: booking.status
    });

    // Update booking status
    await booking.update({ status: response });
    console.log('3. Updated booking status to:', response);

    // Create notification for the user who made the booking
    const notification = await Notification.create({
      user_id: booking.userId,
      title: `Booking ${response === 'accepted' ? 'Accepted' : 'Rejected'}`,
      message: `Your booking request for "${booking.Service.title}" has been ${response === 'accepted' ? 'accepted' : 'rejected'} by ${booking.Service.provider.name}.`,
      type: 'booking_response',
      booking_id: booking.id,
      is_read: false
    });

    console.log('4. Created notification:', {
      id: notification.id,
      user_id: notification.user_id,
      type: notification.type
    });

    // Send socket notification to user
    const io = req.app.get('io');
    io.to(`user_${booking.userId}`).emit('bookingResponse', {
      notification: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        bookingId: notification.booking_id,
        createdAt: notification.created_at
      }
    });

    console.log('5. Sent socket notification');

    res.status(200).json({
      success: true,
      message: `Booking ${response} successfully`,
      data: { booking, notification }
    });

  } catch (error) {
    console.error("Error responding to booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to respond to booking",
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  respondToBooking
};