const { EventSpace } = require('../database');
const { v4: uuidv4 } = require('uuid');

const eventSpaces = [
  {
    id: uuidv4(),
    name: 'Golden Palace',
    description: 'Luxurious venue perfect for weddings and galas',
    location: 'Cite Hasan, Nabeul',
    capacity: 500,
    price: 2000.00,
    amenities: {
      parking: true,
      wifi: true,
      catering: true,
      sound_system: true
    },
    images: [
      'https://example.com/golden-palace-1.jpg',
      'https://example.com/golden-palace-2.jpg'
    ],
    availability: {
      monday: '09:00-23:00',
      tuesday: '09:00-23:00',
      wednesday: '09:00-23:00',
      thursday: '09:00-23:00',
      friday: '09:00-00:00',
      saturday: '09:00-00:00',
      sunday: '09:00-23:00'
    }
  },
  // Add more event spaces as needed
];

const seedEventSpaces = async () => {
  try {
    for (const space of eventSpaces) {
      await EventSpace.create(space);
    }
    console.log('Event spaces seeded successfully!');
  } catch (error) {
    console.error('Error seeding event spaces:', error);
  }
};

module.exports = seedEventSpaces;