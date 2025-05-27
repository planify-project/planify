const { EventSpace, Booking } = require('../database');
const { Op } = require('sequelize');
const path = require('path');
const seedEventSpaces = require('../seed/event__space.seed');

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
    console.log('Received files:', req.files);

    // Validate required fields
    const requiredFields = ['name', 'location', 'price'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Get image URLs from uploaded files
    const imageUrls = req.files ? req.files.map(file => `/uploads/event-spaces/${file.filename}`) : [];

    // Parse amenities safely
    let amenities = {};
    try {
      amenities = req.body.amenities ? JSON.parse(req.body.amenities) : {};
    } catch (e) {
      console.error('Error parsing amenities:', e);
      amenities = {};
    }

    // Parse availability safely
    let availability = {};
    try {
      availability = req.body.availability ? JSON.parse(req.body.availability) : {};
    } catch (e) {
      console.error('Error parsing availability:', e);
      availability = {};
    }

    // Ensure price is a valid number
    const price = parseFloat(req.body.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }

    // Ensure capacity is a valid number
    const capacity = parseInt(req.body.capacity) || 0;
    if (isNaN(capacity) || capacity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be a valid positive number'
      });
    }

    const eventSpaceData = {
      name: req.body.name.trim(),
      description: (req.body.description || '').trim(),
      location: req.body.location.trim(),
      price: price,
      capacity: capacity,
      images: imageUrls,
      amenities: amenities,
      availability: availability,
      isActive: true
    };

    console.log('Creating event space with data:', eventSpaceData);

    const eventSpace = await EventSpace.create(eventSpaceData);
    
    res.status(201).json({
      success: true,
      message: 'Event space created successfully',
      data: eventSpace
    });
  } catch (error) {
    console.error('🔥 Error creating event space:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create event space',
      error: error.message
    });
  }
};

exports.updateEventSpace = async (req, res) => {
  try {
    const eventSpace = await EventSpace.findByPk(req.params.id);
    if (!eventSpace) {
      return res.status(404).json({ error: 'Event space not found' });
    }

    // Get image URLs from uploaded files
    const newImageUrls = req.files ? req.files.map(file => `/uploads/event-spaces/${file.filename}`) : [];
    
    // Combine existing images with new ones if any
    const updatedImages = newImageUrls.length > 0 ? newImageUrls : eventSpace.images;

    const updateData = {
      ...req.body,
      images: updatedImages,
      amenities: JSON.parse(req.body.amenities || '{}'),
      price: parseFloat(req.body.price),
      capacity: parseInt(req.body.capacity) || eventSpace.capacity
    };

    await eventSpace.update(updateData);
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
        event_id: id,
        status: 'confirmed',
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // Create an availability map
    const availabilityMap = {};
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const isBooked = bookings.some(booking => {
        const bookingDate = new Date(booking.date);
        return dateString === bookingDate.toISOString().split('T')[0];
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