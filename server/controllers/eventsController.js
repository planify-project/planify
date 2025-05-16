const { Event } = require('../database');
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
    // Calculate date ranges for current and previous month
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

    // Get paginated events for current month
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await Event.findAndCountAll({
      where: {
        startDate: {
          [Op.gte]: currentMonthStart,
          [Op.lt]: nextMonthStart
        }
      },
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