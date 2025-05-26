const { EventSpace, Booking } = require('../database');
const { Op } = require('sequelize');

exports.getAllEventSpaces = async (req, res) => {
  try {
    const eventSpaces = await EventSpace.findAll({
      where: { isActive: true }
    });
    res.json(eventSpaces);
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    res.status(500).json({ error: 'Failed to fetch event spaces' });
  }
};

exports.getEventSpaceById = async (req, res) => {
  try {
    const eventSpace = await EventSpace.findByPk(req.params.id);
    if (!eventSpace) {
      return res.status(404).json({ error: 'Event space not found' });
    }
    res.json(eventSpace);
  } catch (error) {
    console.error('Error fetching event space:', error);
    res.status(500).json({ error: 'Failed to fetch event space' });
  }
};

exports.createEventSpace = async (req, res) => {
  try {
    console.log('Received data to create:', req.body);
    const eventSpace = await EventSpace.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Event space created successfully',
      data: eventSpace,
    });
  } catch (error) {
    console.error('🔥 Sequelize error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event space',
      error: error.message,
    });
  }
};

exports.updateEventSpace = async (req, res) => {
  try {
    const eventSpace = await EventSpace.findByPk(req.params.id);
    if (!eventSpace) {
      return res.status(404).json({ error: 'Event space not found' });
    }
    await eventSpace.update(req.body);
    res.json(eventSpace);
  } catch (error) {
    console.error('Error updating event space:', error);
    res.status(500).json({ error: 'Failed to update event space' });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date and end date are required' 
      });
    }

    const eventSpace = await EventSpace.findByPk(id);
    if (!eventSpace) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event space not found' 
      });
    }

    // Get all confirmed bookings for this space within the date range
    const bookings = await Booking.findAll({
      where: {
        eventSpaceId: id,
        status: 'confirmed',
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    // Create an availability map
    const availabilityMap = {};
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isBooked = bookings.some(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        return currentDate >= bookingStart && currentDate <= bookingEnd;
      });

      availabilityMap[dateString] = {
        available: !isBooked,
        price: eventSpace.price,
        amenities: eventSpace.amenities
      };

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: availabilityMap
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check availability',
      error: error.message 
    });
  }
};

exports.syncEventSpaces = async (req, res) => {
  try {
    await seedEventSpaces();
    res.status(200).json({ success: true, message: 'Event spaces synced successfully!' });
  } catch (error) {
    console.error('Error syncing event spaces:', error);
    res.status(500).json({ success: false, message: 'Failed to sync event spaces', error: error.message });
  }
};