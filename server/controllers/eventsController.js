const db = require('../database');
const { Event } = db;
const { Op } = require('sequelize');

// GET /api/events?page=1&limit=10
exports.getAllEvents = async (req, res) => {
  try {
    console.log('Fetching all events...');
    const events = await Event.findAll({
      order: [['startDate', 'ASC']]
    });
    
    console.log(`Found ${events.length} events`);
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch events',
      error: error.message 
    });
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
      location: venue?.location || '',
      status: 'pending',
      created_by: req.user?.id || "1",
      budget: venue?.price ? parseFloat(venue.price) : 0
    });

    console.log('Event created:', event);

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('❌ Error creating event:', error.stack || error); // 👈 خليها تبين stack trace
    res.status(500).json({ message: 'Failed to create event', error: error.message });
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
    const { lat, lon, radius = 50 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false,
        message: 'Latitude and longitude are required' 
      });
    }

    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const radiusKm = parseFloat(radius);

    const events = await Event.findAll({
      where: { 
        isPublic: true,
        status: 'approved'
      }
    });

    const nearbyEvents = events.filter(event => {
      if (!event.latitude || !event.longitude) return false;
      const distance = calculateDistance(
        userLat, 
        userLon, 
        event.latitude, 
        event.longitude
      );
      return distance <= radiusKm;
    });

    res.json(nearbyEvents);
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch nearby events',
      error: error.message 
    });
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
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching popular events:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch popular events',
      error: error.message 
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating event with ID:', id);
    console.log('Update data:', req.body);

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.update(req.body);

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting event with ID:', id);

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    await event.destroy();
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event',
      error: error.message 
    });
  }
};

module.exports = {
  getAllEvents: exports.getAllEvents,
  getPublicEvents: exports.getPublicEvents,
  getEventById: exports.getEventById,
  createEvent: exports.createEvent,
  updateEvent: exports.updateEvent,
  deleteEvent: exports.deleteEvent,
  getNearbyEvents: exports.getNearbyEvents,
  getPopularEvents: exports.getPopularEvents
};
