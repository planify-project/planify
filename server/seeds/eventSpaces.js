const { EventSpace } = require('../database');
const { v4: uuidv4 } = require('uuid');

const eventSpaces = [
  {
    id: '1',
    name: 'Golden Palace',
    description: 'Luxurious venue perfect for weddings and galas',
    price: 2000,
    capacity: 300,
    images: [
      'https://cdn0.matrimonio.com/vendor/2888/3_2/960/jpg/Golden%20Palace%20080.jpeg',
      'https://cdn0.matrimonio.com/vendor/2888/3_2/960/jpg/Golden%20Palace%20081.jpeg'
    ],
    location: 'Cite Hasan, Nabeul',
    amenities: {
      wifi: true,
      parking: true,
      catering: true,
      sound_system: true
    },
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
    id: '2',
    name: 'Royal Beach Club',
    description: 'Elegant beachfront venue with stunning sea views',
    price: 1500,
    capacity: 200,
    images: [
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd',
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd'
    ],
    location: 'Hammamet Beach',
    amenities: {
      wifi: true,
      parking: true,
      catering: true,
      pool: true,
      beach_access: true
    },
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
    id: '3',
    name: 'Garden Oasis',
    description: 'Beautiful garden venue perfect for outdoor events',
    price: 1200,
    capacity: 150,
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'
    ],
    location: 'La Marsa',
    amenities: {
      wifi: true,
      parking: true,
      catering: true,
      garden: true,
      outdoor_lighting: true
    },
    availability: {
      monday: '08:00-20:00',
      tuesday: '08:00-20:00',
      wednesday: '08:00-20:00',
      thursday: '08:00-20:00',
      friday: '08:00-22:00',
      saturday: '08:00-22:00',
      sunday: '08:00-20:00'
    }
  },
  {
    id: '4',
    name: 'Modern Loft',
    description: 'Contemporary urban space for corporate events',
    price: 1800,
    capacity: 100,
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72'
    ],
    location: 'Tunis City Center',
    amenities: {
      wifi: true,
      parking: true,
      catering: true,
      projector: true,
      sound_system: true,
      air_conditioning: true
    },
    availability: {
      monday: '08:00-22:00',
      tuesday: '08:00-22:00',
      wednesday: '08:00-22:00',
      thursday: '08:00-22:00',
      friday: '08:00-23:00',
      saturday: '10:00-23:00',
      sunday: '10:00-20:00'
    }
  },
  {
    id: '5',
    name: 'Historic Villa',
    description: 'Charming historic villa for intimate gatherings',
    price: 2500,
    capacity: 80,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
    ],
    location: 'Sidi Bou Said',
    amenities: {
      wifi: true,
      parking: true,
      catering: true,
      garden: true,
      historic_architecture: true
    },
    availability: {
      monday: '10:00-22:00',
      tuesday: '10:00-22:00',
      wednesday: '10:00-22:00',
      thursday: '10:00-22:00',
      friday: '10:00-23:00',
      saturday: '10:00-23:00',
      sunday: '10:00-22:00'
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

const seedEventSpaces = require('./eventSpaces');

async function runSeed() {
  try {
    await seedEventSpaces();
    console.log('Event spaces seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding event spaces:', error);
    process.exit(1);
  }
}

runSeed();