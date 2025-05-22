const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const EventSpace = require('../models/eventSpace');

const generateTunisianEventSpace = () => ({
  name: faker.helpers.arrayElement([
    'Dar El Bey',
    'Espace Côte Bleue',
    'Villa Jasmin',
    'Jardin Andalou',
    'Salle Afrah Carthage',
  ]),
  description: faker.helpers.arrayElement([
    'A beautiful traditional Tunisian venue perfect for intimate events.',
    'Stunning modern event space with sea views.',
    'Elegant villa surrounded by a lush garden.',
    'Charming space with Andalusian architecture.',
    'Spacious hall ideal for large celebrations.',
    'Historic site offering a unique event experience.',
  ]),
  location: faker.helpers.arrayElement([
    'Medina of Tunis',
    'Sidi Bou Said',
    'Hammamet',
    'Sousse',
    'Djerba',
    'Gammarth',
    'La Marsa',
  ]),
  price: faker.helpers.arrayElement([800, 1200, 1500, 2000, 3000, 5000, 7000]), // Prices in DT
  amenities: {
    pool: faker.datatype.boolean(),
    wifi: faker.datatype.boolean(),
    parking: faker.datatype.boolean(),
    catering: faker.datatype.boolean(),
    beach_access: faker.datatype.boolean(),
  },
  images: [
    'https://via.placeholder.com/400x300?text=Event+Space+Image+1',
    'https://via.placeholder.com/400x300?text=Event+Space+Image+2',
    'https://via.placeholder.com/400x300?text=Event+Space+Image+3',
  ],
});

const seedEventSpaces = async (numEventSpaces = 10) => {
  try {
    await EventSpace.deleteMany({});
    console.log('Existing event spaces cleared.');

    const eventSpaces = Array.from({ length: numEventSpaces }, () => generateTunisianEventSpace());
    await EventSpace.insertMany(eventSpaces);

    console.log(`${numEventSpaces} Tunisian event spaces seeded successfully.`);
  } catch (error) {
    console.error('Error seeding event spaces:', error);
  }
};

module.exports = seedEventSpaces;
