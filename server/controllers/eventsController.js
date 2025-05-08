// const db = require('../database');
// const { Event } = db;

// // GET /api/events?page=1&limit=10
// exports.getAllEvents = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const { count, rows } = await Event.findAndCountAll({
//       offset,
//       limit,
//       order: [['startDate', 'ASC']], // Updated to use startDate
//     });

//     res.json({
//       events: rows,
//       total: count,
//       page,
//       totalPages: Math.ceil(count / limit),
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch events', details: error.message });
//   }
// };

// exports.getPublicEvents = async (req, res) => {
//   try {
//     const publicEvents = await Event.findAll({
//       where: { isPublic: true },
//       order: [['startDate', 'ASC']], // Updated to use startDate
//     });

//     res.status(200).json(publicEvents);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch public events', details: error.message });
//   }
// }
// exports.createEvent = async (req, res) => {
//   try {
//     console.log('Received event data:', req.body);

//     const {
//       title,
//       type,
//       date,
//       venue,
//       services = [],
//       equipment = []
//     } = req.body;

//     // Create the event with existing model structure
//     const event = await Event.create({
//       title,
//       type: type || 'social',
//       event_date: date,
//       venue_id: venue?.id,
//       status: 'pending',
//       user_id: 1, // Default user ID until auth is implemented
//       budget: parseFloat(venue?.price || 0)
//     });

//     console.log('Event created:', event);

//     res.status(201).json({
//       success: true,
//       data: event,
//       message: 'Event created successfully'
//     });

//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const db = require('../database');
const { Event, User } = db;

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
// GET /api/events/public?category=<category>
// exports.getPublicEvents = async (req, res) => {
//   try {
//     const category = req.query.category; 
//     console.log(category);
//     // Get the category from query parameters

//     // Build the where clause for filtering
//     const whereClause = { isPublic: true }; // Only fetch public events
//     if (category) {
//       whereClause.category = category; // Add category filter if provided
//     }

//     // Fetch events with filtering and sorting
//     const publicEvents = await Event.findAll({
//       where: whereClause,
//       attributes: ['id', 'name', 'location', 'ticketPrice', 'is_free', 'rating', 'coverImage', 'category'],
//       order: [['startDate', 'ASC']], // Sort by startDate in ascending order
//       include: [
//         {
//           model: User,
//           as: 'creator', // Include the creator of the event
//           attributes: ['id', 'name', 'email'],
//         },
//         {
//           model: User,
//           as: 'attendees', // Include attendees of the event
//           attributes: ['id', 'name'],
//           through: { attributes: [] }, // Exclude join table attributes
//         },
//       ],
//     });

//     // Format the events to include attendees count
//     const formattedEvents = publicEvents.map((event) => ({
//       ...event.toJSON(),
//       attendees_count: event.attendees?.length || 0,
//     }));

//     res.status(200).json(formattedEvents); // Return the formatted events
//   } catch (error) {
//     console.error('Error fetching public events:', error);
//     res.status(500).json({ error: 'Server error while fetching public events' });
//   }
// };
// GET /api/events/public?type=wedding
exports.getPublicEvents = async (req, res) => {
  try {
    const eventType = req.query.type; // Use "type" instead of "category"

    const whereClause = { isPublic: true };
    if (eventType) {
      whereClause.type = eventType;
    }

    const publicEvents = await Event.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'location', 'ticketPrice', 'is_free', 'coverImage', 'type'],

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
    res.status(500).json({ error: 'Server error while fetching public events' });
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