const db = require('../database');
const { Event, User } = db;
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
      equipment = [],
      latitude,
      longitude,
      location,
      created_by
    } = req.body;

    // Validate required fields
    if (!name || !date || !created_by) {
      return res.status(400).json({
        success: false,
        message: "Event name, date, and creator ID are required"
      });
    }

    // Verify user exists
    const user = await User.findByPk(created_by);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Basic validation for latitude and longitude if provided
    if ((latitude !== undefined && latitude !== null && isNaN(parseFloat(latitude))) || (longitude !== undefined && longitude !== null && isNaN(parseFloat(longitude)))) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude format"
      });
    }

    const event = await Event.create({
      name,
      type: type || 'social',
      startDate: date,
      location: location || venue?.name || '',
      latitude: latitude !== undefined && latitude !== null ? parseFloat(latitude) : null,
      longitude: longitude !== undefined && longitude !== null ? parseFloat(longitude) : null,
      status: 'pending',
      created_by,
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

    const {
      name,
      description,
      type,
      startDate,
      endDate,
      location,
      latitude,
      longitude,
      category,
      isPublic,
      status,
      maxParticipants,
      ticketPrice,
      coverImage,
      budget,
      is_free
    } = req.body;

     // Basic validation for latitude and longitude if provided
     if ((latitude !== undefined && latitude !== null && isNaN(parseFloat(latitude))) || (longitude !== undefined && longitude !== null && isNaN(parseFloat(longitude)))) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude format for update"
      });
    }

    const updateData = {
      name,
      description,
      type,
      startDate,
      endDate,
      location,
      latitude: latitude !== undefined && latitude !== null ? parseFloat(latitude) : event.latitude, // Only update if provided
      longitude: longitude !== undefined && longitude !== null ? parseFloat(longitude) : event.longitude, // Only update if provided
      category,
      isPublic,
      status,
      maxParticipants,
      ticketPrice,
      coverImage,
      budget,
      is_free
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    await event.update(updateData);
    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.error('Error updating event:', error);
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

exports.searchEvents = async (req, res) => {
  try {
    const { name, date, location, type } = req.query;
    
    // Build the where clause
    const whereClause = { 
      isPublic: true,
      [Op.or]: [
        { status: 'approved' },
        { status: 'confirmed' }
      ]
    };

    // Add search conditions if provided
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%` // Using like instead of iLike for MySQL
      };
    }

    if (location) {
      whereClause.location = {
        [Op.like]: `%${location}%` // Using like instead of iLike for MySQL
      };
    }

    if (date) {
      try {
        // Convert date string to Date object
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);

        whereClause.startDate = {
          [Op.between]: [searchDate, nextDay]
        };
      } catch (error) {
        console.error('Error parsing date:', error);
        // If date parsing fails, ignore the date filter
      }
    }

    if (type && type !== 'All') {
      whereClause.type = type;
    }

    console.log('Search query:', req.query);
    console.log('Where clause:', JSON.stringify(whereClause, null, 2));

    // Execute the query with error handling
    const events = await Event.findAll({
      where: whereClause,
      order: [['startDate', 'ASC']],
      attributes: [
        'id', 'name', 'description', 'type', 'startDate', 'endDate',
        'location', 'latitude', 'longitude', 'isPublic', 'status',
        'maxParticipants', 'ticketPrice', 'coverImage', 'created_by',
        'attendees_count', 'available_spots', 'budget', 'is_free'
      ]
    });

    console.log(`Found ${events.length} events matching search criteria`);

    // Format the response
    const formattedEvents = events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      latitude: event.latitude,
      longitude: event.longitude,
      isPublic: event.isPublic,
      status: event.status,
      maxParticipants: event.maxParticipants,
      ticketPrice: event.ticketPrice,
      coverImage: event.coverImage,
      attendees_count: event.attendees_count,
      available_spots: event.available_spots,
      budget: event.budget,
      is_free: event.is_free
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({ 
      error: 'Failed to search events', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Admin only update event status
exports.updateStatus = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update({ status: req.body.status });
    res.json({
      success: true,
      data: event,
      message: 'Event status updated successfully'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event status', details: error.message });
  }
}

// Admin only status-summary
exports.getStatusSummary = async (req, res) => {
  try {
    const { Event } = require('../database');

    const statuses = ['pending', 'approved', 'rejected', 'cancelled', 'completed'];

    const results = await Promise.all(
      statuses.map(async (status) => {
        const count = await Event.count({ where: { status } });
        return { status, count };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event status summary', details: error.message });
  }
};

//Admin only get all events with pagination
exports.getAllEventsAdmin = async (req, res) => {
  try {
    // Calculate date ranges for current and previous month (for stats only)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Count events for current month
    const currentMonthCount = await Event.count({
      where: {
        startDate: {
          [Op.gte]: currentMonthStart,
          [Op.lt]: nextMonthStart
        }
      }
    });

    // Count events for previous month
    const previousMonthCount = await Event.count({
      where: {
        startDate: {
          [Op.gte]: previousMonthStart,
          [Op.lt]: currentMonthStart
        }
      }
    });

    // Calculate percentage change
    let change = 0;
    let positive = true;
    if (previousMonthCount > 0) {
      change = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
      positive = currentMonthCount >= previousMonthCount;
    } else if (currentMonthCount > 0) {
      change = 100;
      positive = true;
    }

    // Get paginated events (all events, no date filter)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build filter object
    const where = {};
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.location) {
      where.location = req.query.location;
    }
    if (req.query.isApproved) {
      // If isApproved is 'true', filter for status 'approved', if 'false', filter for not approved
      if (req.query.isApproved === 'true') {
        where.status = 'approved';
      } else if (req.query.isApproved === 'false') {
        where.status = { [Op.ne]: 'approved' };
      }
    }
    if (req.query.type) {
      where.type = req.query.type;
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      offset,
      limit,
      order: [['startDate', 'ASC']],
    });

    res.json({
      events: rows,
      total: count,
      currentMonthCount,
      previousMonthCount,
      change: parseFloat(change.toFixed(2)),
      positive,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
};

// Admin only get all private events this year, grouped by month
exports.getPrivateEventsThisYear = async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const events = await Event.findAll({
      where: {
        startDate: {
          [Op.gte]: startOfYear,
          [Op.lt]: endOfYear
        },
        isPublic: false
      },
      order: [[Event.sequelize.fn('DATE_FORMAT', Event.sequelize.col('startDate'), '%Y-%m-01'), 'ASC']],
      attributes: [
        [Event.sequelize.fn('DATE_FORMAT', Event.sequelize.col('startDate'), '%Y-%m-01'), 'month'],
        [Event.sequelize.fn('COUNT', Event.sequelize.col('id')), 'count']
      ],
      group: [Event.sequelize.fn('DATE_FORMAT', Event.sequelize.col('startDate'), '%Y-%m-01')],
      raw: true
    });

    res.json({
      months: events.map(e => ({
        month: e.month,
        count: parseInt(e.count, 10)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch private events', details: error.message });
  }
}

// Admin only get all public events this year, grouped by month
exports.getPublicEventsThisYear = async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const events = await Event.findAll({
      where: {
        startDate: {
          [Op.gte]: startOfYear,
          [Op.lt]: endOfYear
        },
        isPublic: true
      },
      order: [[Event.sequelize.fn('DATE_FORMAT', Event.sequelize.col('startDate'), '%Y-%m-01'), 'ASC']],
      attributes: [
        [Event.sequelize.fn('DATE_FORMAT', Event.sequelize.col('startDate'), '%Y-%m-01'), 'month'],
        [Event.sequelize.fn('COUNT', Event.sequelize.col('id')), 'count']
      ],
      group: [Event.sequelize.fn('DATE_FORMAT', Event.sequelize.col('startDate'), '%Y-%m-01')],
      raw: true
    });

    res.json({
      months: events.map(e => ({
        month: e.month,
        count: parseInt(e.count, 10)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public events', details: error.message });
  }
}

// Admin only event status distribution
exports.getEventStatusDistribution = async (req, res) => {
  try {
    const statuses = ['pending', 'approved', 'rejected', 'cancelled', 'completed'];

    const results = await Promise.all(
      statuses.map(async (status) => {
        const count = await Event.count({ where: { status } });
        return { status, count };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event status distribution', details: error.message });
  }
}
// Admin update event
exports.adminUpdateEvent = async (req, res) => {
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

// admin only get all event ypes
exports.getEventTypes = async (req, res) => {
  try {
    const types = await Event.findAll({
      attributes: [
        [Event.sequelize.fn('DISTINCT', Event.sequelize.col('type')), 'type']
      ],
      raw: true
    });
    res.json({ types: types.map(t => t.type).filter(Boolean) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event types', details: error.message });
  }
};