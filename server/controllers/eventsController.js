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
//       order: [['date', 'ASC']]
//     });

//     res.json({
//       events: rows,
//       total: count,
//       page,
//       totalPages: Math.ceil(count / limit)
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch events', details: error.message });
//   }
// }; 
// exports.getPublicEvents = async (req, res) => {
//   try {
//     const publicEvents = await Event.findAll({
//       where: { isPublic: true },
//       order: [['date', 'ASC']], // Sort by date
//     });

//     res.status(200).json(publicEvents);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch public events', details: error.message });
//   }
// };

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

exports.getPublicEvents = async (req, res) => {
  try {
    const publicEvents = await Event.findAll({
      where: { isPublic: true },
      order: [['startDate', 'ASC']], // Updated to use startDate
    });

    res.status(200).json(publicEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public events', details: error.message });
  }
};