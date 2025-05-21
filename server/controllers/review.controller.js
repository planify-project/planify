const db = require('../database');
const { Review, User } = db;

exports.createReview = async (req, res) => {
  try {
    const { event_id, service_id, rating, comment, title } = req.body;
    
    // Basic validation
    if (!rating || !comment || !title) {
      return res.status(400).json({ message: 'Rating, comment and title are required' });
    }

    if (!(event_id || service_id)) {
      return res.status(400).json({ message: 'Either event_id or service_id is required' });
    }

    // Create the review
    const newReview = await Review.create({
      reviewer_id: req.session?.userId, // Use session ID instead of JWT
      event_id,
      service_id,
      rating,
      comment,
      title,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReviewsByEvent = async (req, res) => {
  try {
    const { event_id } = req.params;

    if (!event_id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const reviews = await Review.findAll({
      where: { event_id },
      include: [{
        model: User,
        attributes: ['name'], // Changed from first_name/last_name to name
      }],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getReviewsByService = async (req, res) => {
  try {
    const { service_id } = req.params;

    const reviews = await Review.findAll({
      where: { service_id },
      include: [{
        model: User,
        attributes: ['first_name', 'last_name'],
      }],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};