const { Booking, Service, User, Event, Notification } = require('../database');

const createBooking = async (req, res) => {
  const { user_id, service_id, event_id, date, space, phone_number } = req.body;
  console.log('Received booking data:', req.body);

  // Validate required fields
  if (!user_id || !service_id || !event_id || !date || !space || !phone_number) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required",
      missingFields: {
        user_id: !user_id,
        service_id: !service_id,
        event_id: !event_id,
        date: !date,
        space: !space,
        phone_number: !phone_number
      }
    });
  }

  try {
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

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if service exists
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Check if event exists
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Check for existing booking at the same time
    const existingBooking = await Booking.findOne({
      where: {
        service_id,
        date: bookingDate,
        status: ['requested', 'confirmed']
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "Service is already booked for this time"
      });
    }

    const newBooking = await Booking.create({
      user_id,
      service_id,
      event_id,
      date: bookingDate,
      space,
      phone_number,
      status: 'requested',
    });

    // Create notification for the service provider
    const notification = await Notification.create({
      user_id: service.provider_id,
      title: 'New Booking Request',
      message: `You have a new booking request for your service "${service.type}"`,
      is_read: false,
      type: 'booking',
      booking_id: newBooking.id
    });

    // Send real-time notification to service provider
    const io = req.app.get('io');
    io.to(`user_${service.provider_id}`).emit('newBooking', {
      notification,
      booking: newBooking
    });

    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Booking created successfully"
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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

    const existingBooking = await Booking.findByPk(bookingId);
    if (!existingBooking) return res.status(404).json({ message: "Booking not found" });

    existingBooking.status = response;
    await existingBooking.save();

    // Create notification for the customer
    const notification = await Notification.create({
      user_id: existingBooking.user_id,
      title: `Booking ${response}`,
      message: `Your booking has been ${response} by the provider.`,
      is_read: false,
      type: 'response',
      booking_id: existingBooking.id
    });

    // Send real-time notification to customer
    const io = req.app.get('io');
    io.to(`user_${existingBooking.user_id}`).emit('bookingResponse', {
      notification,
      booking: existingBooking
    });

    res.status(200).json(existingBooking);
  } catch (error) {
    console.error("Error responding to booking:", error);
    res.status(500).json({ message: "Failed to respond to booking." });
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
