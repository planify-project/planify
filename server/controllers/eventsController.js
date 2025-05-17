const db = require('../database');
const { Event } = db;
const { Op } = require('sequelize');

// GET /api/events?page=1&limit=10
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      offset,
      limit,
      order: [['startDate', 'ASC']],
    });

    res.json({
      events: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
};

exports.getPublicEvents = async (req, res) => {
  try {
    console.log('Fetching public events...');
    const publicEvents = await Event.findAll({
      where: { isPublic: true },
      order: [['startDate', 'ASC']]
    });
    
    console.log(`Found ${publicEvents.length} public events`);
    res.status(200).json(publicEvents);
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch public events', 
      details: error.message 
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event', details: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);

    const {
      name,      
      type,
      date,
      venue,
      services = [],
      equipment = []
    } = req.body;

    const event = await Event.create({
      name,
      type: type || 'social',
      startDate: date,
      location: venue?.name || '',
      status: 'pending',
      created_by: 1,
      budget: venue?.price ? parseFloat(venue.price) : 0
    });

    console.log('Event created:', event);

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// GET /api/events/nearby?lat=36.8065&lon=10.1815&radius=50
exports.getNearbyEvents = async (req, res) => {
  try {
    const { lat, lon, radius = 50 } = req.query; // radius in km
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const radiusKm = parseFloat(radius);

    if (!userLat || !userLon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Get all public events
    const events = await Event.findAll({
      where: { 
        isPublic: true,
        status: 'approved',
        latitude: { [Op.not]: null },
        longitude: { [Op.not]: null }
      }
    });

    // Filter events by distance
    const nearbyEvents = events.filter(event => {
      const distance = calculateDistance(
        userLat, 
        userLon, 
        event.latitude, 
        event.longitude
      );
      return distance <= radiusKm;
    });

    // Sort by distance
    nearbyEvents.sort((a, b) => {
      const distA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
      const distB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
      return distA - distB;
    });

    res.json(nearbyEvents);
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({ error: 'Failed to fetch nearby events', details: error.message });
  }
};

// GET /api/events/popular
exports.getPopularEvents = async (req, res) => {
  try {
    console.log('Fetching popular events...');
    const events = await Event.findAll({
      where: { 
        isPublic: true,
        status: 'approved'
      },
      order: [
        ['attendees_count', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 10
    });

    console.log(`Found ${events.length} popular events`);
    res.json(events);
  } catch (error) {
    console.error('Error fetching popular events:', error);
    res.status(500).json({ error: 'Failed to fetch popular events', details: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update(req.body);
    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
};
