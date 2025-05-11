// // controllers/reviewController.js
// const db = require('../database'); // Assuming models are correctly imported

// exports.createReview = async (req, res) => {
//   const { rating, comment } = req.body;
//   const { serviceId } = req.params;
//   const reviewer_id = req.user.id; // Mta3 auth middleware

//   try {
//     // Optional: Check if el user deja 3andou review lel service
//     const existingReview = await db.review.findOne({
//       where: {
//         reviewer_id,
//         service_id: serviceId
//       }
//     });
//     if (existingReview) {
//       return res.status(400).json({ message: 'You have already reviewed this service.' });
//     }

//     const newReview = await db.review.create({
//       reviewer_id,
//       service_id: serviceId,
//       rating,
//       comment,
//       created_at: new Date()
//     });
//     res.status(201).json(newReview);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating review', error: error.message });
//   }
// },
// exports.getReviewsForService = async (req, res) => {
//     const { serviceId } = req.params;
//     try {
//       const reviews = await db.review.findAll({
//         where: {
//           service_id: serviceId
//         },
//         include: [{
//           model: db.user,   // Ensure you have set up the association in your models!
//           attributes: ['username']
//         }],
//         order: [['created_at', 'DESC']]
//       });
//       res.json(reviews);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching reviews', error: error.message });
//     }
//   };
  
// controllers/reviewController.js
exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { eventId } = req.params;
  const reviewer_id = req.user.id;

  try {
    const existingReview = await db.review.findOne({
      where: {
        reviewer_id,
        event_id: eventId
      }
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this event.' });
    }

    const newReview = await db.review.create({
      reviewer_id,
      event_id: eventId,
      rating,
      comment,
      created_at: new Date()
    });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

exports.getReviewsForEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const reviews = await db.review.findAll({
      where: {
        event_id: eventId
      },
      include: [{
        model: db.user,
        attributes: ['username']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
