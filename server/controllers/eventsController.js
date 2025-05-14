const { Event } = require('../database');

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
