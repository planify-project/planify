const db = require('../database');
const { review, user } = db;

exports.createReview = async (req, res) => {
  try {
    const { event_id, service_id, rating, comment, title } = req.body;
    const reviewer_id = req.user.id; // Assuming auth middleware sets req.user

    // Validation
    if (!reviewer_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!rating || !comment || !title) {
      return res.status(400).json({ message: 'Rating, comment and title are required' });
    }

    if (!(event_id || service_id)) {
      return res.status(400).json({ message: 'Either event_id or service_id is required' });
    }

    // Check for existing review
    const existingReview = await review.findOne({
      where: {
        reviewer_id,
        ...(event_id ? { event_id } : { service_id }),
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const newReview = await review.create({
      reviewer_id,
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

    const reviews = await review.findAll({
      where: { event_id },
      include: [{
        model: user,
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
