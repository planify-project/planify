const db = require('../database');
const { Event } = db;

// GET /api/events?page=1&limit=10
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      offset,
      limit,
      order: [['date', 'ASC']]
    });

    res.json({
      events: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);

    const {
      title,
      type,
      date,
      venue,
      services = [],
      equipment = []
    } = req.body;

    // Create the event with existing model structure
    const event = await Event.create({
      title,
      type: type || 'social',
      event_date: date,
      venue_id: venue?.id,
      status: 'pending',
      user_id: 1, // Default user ID until auth is implemented
      budget: parseFloat(venue?.price || 0)
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