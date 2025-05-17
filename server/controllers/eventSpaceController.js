const { EventSpace } = require('../database');
const seedEventSpaces = require('../seeds/eventSpaces');

exports.getAllEventSpaces = async (req, res) => {
  try {
    const eventSpaces = await EventSpace.findAll({
      where: { isActive: true }
    });
    res.json(eventSpaces);
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    res.status(500).json({ error: 'Failed to fetch event spaces' });
  }
};

exports.getEventSpaceById = async (req, res) => {
  try {
    const eventSpace = await EventSpace.findByPk(req.params.id);
    if (!eventSpace) {
      return res.status(404).json({ error: 'Event space not found' });
    }
    res.json(eventSpace);
  } catch (error) {
    console.error('Error fetching event space:', error);
    res.status(500).json({ error: 'Failed to fetch event space' });
  }
};

exports.createEventSpace = async (req, res) => {
  try {
    const eventSpace = await EventSpace.create(req.body);
    res.status(201).json(eventSpace);
  } catch (error) {
    console.error('Error creating event space:', error);
    res.status(500).json({ error: 'Failed to create event space' });
  }
};

exports.updateEventSpace = async (req, res) => {
  try {
    const eventSpace = await EventSpace.findByPk(req.params.id);
    if (!eventSpace) {
      return res.status(404).json({ error: 'Event space not found' });
    }
    await eventSpace.update(req.body);
    res.json(eventSpace);
  } catch (error) {
    console.error('Error updating event space:', error);
    res.status(500).json({ error: 'Failed to update event space' });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    const eventSpace = await EventSpace.findByPk(id);
    
    if (!eventSpace) {
      return res.status(404).json({ error: 'Event space not found' });
    }

    // Check availability logic here
    const isAvailable = true; // Replace with actual availability check
    
    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
};

exports.syncEventSpaces = async (req, res) => {
  try {
    await seedEventSpaces();
    res.status(200).json({ success: true, message: 'Event spaces synced successfully!' });
  } catch (error) {
    console.error('Error syncing event spaces:', error);
    res.status(500).json({ success: false, message: 'Failed to sync event spaces', error: error.message });
  }
};