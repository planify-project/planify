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
      'https://cdn0.matrimonio.com/vendor/2888/3_2/960/jpg/Golden%20Palace%20080.jpeg',
      'https://cdn0.matrimonio.com/vendor/2888/3_2/960/jpg/Golden%20Palace%20081.jpeg'
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
  {
    id: uuidv4(),
    name: 'Royal Beach Club',
    description: 'Elegant beachfront venue with stunning ocean views',
    location: 'Hammamet Beach',
    capacity: 300,
    price: 1500.00,
    amenities: {
      parking: true,
      wifi: true,
      catering: true,
      beach_access: true,
      pool: true
    },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
    ],
    availability: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-23:00',
      saturday: '10:00-23:00',
      sunday: '10:00-22:00'
    }
  },
  {
    id: uuidv4(),
    name: 'Digital Valley Center',
    description: 'Modern conference center perfect for corporate events',
    location: 'Technopole El Ghazala',
    capacity: 200,
    price: 1200.00,
    amenities: {
      parking: true,
      wifi: true,
      catering: true,
      projector: true,
      sound_system: true
    },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2'
    ],
    availability: {
      monday: '08:00-20:00',
      tuesday: '08:00-20:00',
      wednesday: '08:00-20:00',
      thursday: '08:00-20:00',
      friday: '08:00-18:00',
      saturday: '09:00-17:00',
      sunday: 'Closed'
    }
  }
];

const seedEventSpaces = async () => {
  try {
    // Clear existing data
    await EventSpace.destroy({ where: {} });
    
    // Insert new data
    for (const space of eventSpaces) {
      await EventSpace.create(space);
    }
    console.log('Event spaces seeded successfully!');
  } catch (error) {
    console.error('Error seeding event spaces:', error);
    throw error;
  }
};

module.exports = seedEventSpaces;