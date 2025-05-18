const { Booking, Service, User, Event, Notification } = require('../database');

const createBooking = async (req, res) => {
  const { user_id, service_id, date, space, phone_number } = req.body;
  console.log('Received booking data:', req.body);

  try {
    // Validate required fields
    if (!user_id || !service_id || !date || !space || !phone_number) {
      console.log('Missing required fields:', { user_id, service_id, date, space, phone_number });
      return res.status(400).json({ 
        success: false,
        message: "All fields are required"
      });
    }

    // Validate date format
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    // Check if date is in the future
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Booking date must be in the future"
      });
    }

    // Validate phone number format (8 digits for Tunisia)
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be exactly 8 digits"
      });
    }

    // Check if service exists
    const service = await Service.findByPk(service_id);
    if (!service) {
      console.log('Service not found:', service_id);
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Get user details for notification
    console.log('Looking up user with Firebase UID:', user_id);
    const user = await User.findOne({ where: { firebase_uid: user_id } });
    if (!user) {
      console.log('User not found with Firebase UID:', user_id);
      return res.status(404).json({
        success: false,
        message: "User not found. Please try logging out and logging back in."
      });
    }

    console.log('Found user:', user.id);

    // Create booking
    const newBooking = await Booking.create({
      userId: user.id,
      serviceId: service_id,
      providerId: service.provider_id,
      date: bookingDate,
      space: space,
      phone: phone_number,
      status: 'pending'
    });

    // Create notification for service provider
    const notification = await Notification.create({
      user_id: service.provider_id,
      title: 'New Booking Request',
      message: `${user.name} has requested to book your service for ${bookingDate.toLocaleDateString()}`,
      type: 'booking',
      booking_id: newBooking.id,
      is_read: false,
      metadata: {
        bookingId: newBooking.id,
        serviceId: service_id,
        userId: user.id,
        userName: user.name,
        date: bookingDate,
        space: space
      }
    });

    // Get socket instance
    const io = req.app.get('io');
    if (io) {
      // Emit to provider's room
      io.to(`user_${service.provider_id}`).emit('notification', {
        type: 'booking',
        notification,
        booking: newBooking
      });

      // Also emit to user's room for confirmation
      io.to(`user_${user.id}`).emit('notification', {
        type: 'booking_confirmation',
        notification: {
          title: 'Booking Request Sent',
          message: `Your booking request for ${service.title} has been sent to the provider.`,
          type: 'booking_confirmation',
          booking_id: newBooking.id,
          is_read: false
        },
        booking: newBooking
      });
    }

    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Booking created successfully"
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
        { model: User, attributes: ['id', 'fullName'] },
        { model: Service, attributes: ['id', 'name'] },
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
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
};

const respondToBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { response } = req.body; // 'confirmed' or 'canceled'

    const existingBooking = await Booking.findByPk(bookingId, {
      include: [
        { model: User, as: 'user' },
        { model: Service, as: 'service' }
      ]
    });

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update booking status
    existingBooking.status = response;
    await existingBooking.save();

    // Create notification for the customer
    const notification = await Notification.create({
      user_id: existingBooking.userId,
      title: `Booking ${response}`,
      message: `Your booking for ${existingBooking.service.title} has been ${response} by the provider.`,
      is_read: false,
      type: 'booking_response',
      booking_id: existingBooking.id,
      metadata: {
        bookingId: existingBooking.id,
        serviceId: existingBooking.serviceId,
        status: response,
        date: existingBooking.date
      }
    });

    // Get socket instance
    const io = req.app.get('io');
    if (io) {
      // Emit to customer's room
      io.to(`user_${existingBooking.userId}`).emit('notification', {
        type: 'booking_response',
        notification,
        booking: existingBooking
      });

      // Also emit to provider's room for confirmation
      io.to(`user_${existingBooking.providerId}`).emit('notification', {
        type: 'booking_response_confirmation',
        notification: {
          title: 'Booking Response Sent',
          message: `You have ${response} the booking request.`,
          type: 'booking_response_confirmation',
          booking_id: existingBooking.id,
          is_read: false
        },
        booking: existingBooking
      });
    }

    res.status(200).json({
      success: true,
      data: existingBooking,
      message: `Booking ${response} successfully`
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
