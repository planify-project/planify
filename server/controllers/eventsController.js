const db = require('../database');
const { Event, User } = db;
const { Op } = require('sequelize'); // Make sure Op is imported

// GET /api/events?page=1&limit=10
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      offset,
      limit,
      order: [['startDate', 'ASC']], // Updated to use startDate
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
// GET /api/events/public?type=wedding
// exports.getPublicEvents = async (req, res) => {
//   try {
//     const eventType = req.query.type; // Use "type" instead of "category"

//     const whereClause = { isPublic: true };
//     if (eventType) {
//       whereClause.type = eventType;
//     }

//     const publicEvents = await Event.findAll({
//       where: whereClause,
//       attributes: ['id', 'name', 'location', 'ticketPrice', 'is_free', 'coverImage', 'type'],

//       order: [['startDate', 'ASC']],
//       include: [
//         {
//           model: User,
//           as: 'creator',
//           attributes: ['id', 'name', 'email'],
//         },
//         {
//           model: User,
//           as: 'attendees',
//           attributes: ['id', 'name'],
//           through: { attributes: [] },
//         },
//       ],
//     });

//     const formattedEvents = publicEvents.map((event) => ({
//       ...event.toJSON(),
//       attendees_count: event.attendees?.length || 0,
//     }));

//     res.status(200).json(formattedEvents);
//   } catch (error) {
//     console.error('Error fetching public events:', error);
//     res.status(500).json({ error: 'Server error while fetching public events' });
//   }
// };




// exports.getPublicEvents = async (req, res) => {
//   try {
//     const eventType = req.query.type;
//     const searchQuery = req.query.search?.toLowerCase();

//     const whereClause = {
//       isPublic: true,
//     };

//     if (eventType && eventType !== 'All') {
//       whereClause.type = eventType;
//     }

//     if (searchQuery) {
//       whereClause[Op.or] = [
//         { name: { [Op.like]: `%${searchQuery}%` } },
//         { location: { [Op.like]: `%${searchQuery}%` } },
//         { startDate: { [Op.like]: `%${searchQuery}%` } }
//       ];
//     }

//     const publicEvents = await Event.findAll({
//       where: whereClause,
//       attributes: ['id', 'name', 'location', 'ticketPrice', 'is_free', 'coverImage', 'type', 'startDate'],
//       order: [['startDate', 'ASC']],
//       include: [
//         {
//           model: User,
//           as: 'creator',
//           attributes: ['id', 'name', 'email'],
//         },
//         {
//           model: User,
//           as: 'attendees',
//           attributes: ['id', 'name'],
//           through: { attributes: [] },
//         },
//       ],
//     });

//     const formattedEvents = publicEvents.map((event) => ({
//       ...event.toJSON(),
//       attendees_count: event.attendees?.length || 0,
//     }));

//     res.status(200).json(formattedEvents);
//   } catch (error) {
//     console.error('Error fetching public events:', error);
//     res.status(500).json({ error: 'Server error while fetching public events' });
//   }
// };

exports.getPublicEvents = async (req, res) => {
  try {
    const eventType = req.query.type;
    const searchQuery = req.query.search;

    const whereClause = {
      isPublic: true,
    };

    if (eventType && eventType !== 'All') {
      whereClause.type = eventType;
    }

    if (searchQuery) {
      whereClause[Op.or] = [
        { 
          name: { 
            [Op.like]: `%${searchQuery}%` 
          }
        },
        { 
          location: { 
            [Op.like]: `%${searchQuery}%` 
          }
        },
        { 
          startDate: { 
            [Op.like]: `%${searchQuery}%` 
          }
        }
      ];
    }

    console.log('Search Query:', searchQuery); // Add logging
    console.log('Where Clause:', whereClause); // Add logging

    const publicEvents = await Event.findAll({
      where: whereClause,
      attributes: [
        'id', 
        'name', 
        'location', 
        'ticketPrice', 
        'is_free', 
        'coverImage', 
        'type', 
        'startDate'
      ],
      order: [['startDate', 'ASC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'attendees',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    const formattedEvents = publicEvents.map((event) => ({
      ...event.toJSON(),
      attendees_count: event.attendees?.length || 0,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({ 
      error: 'Server error while fetching public events',
      details: error.message 
    });
  }
};
// POST /api/events
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
