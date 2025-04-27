// This script seeds the database with sample events for development/testing
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const db = require('./database');
const { Event, User } = db;

async function seedEvents() {
  await db.sequelize.sync({ force: false }); // Do not drop tables, just insert

  // Seed users first
  const users = [
    {
      id: 1,
      name: 'Alice Organizer',
      email: 'alice@example.com',
      password: 'password123',
      role: 'organizer'
    },
    {
      id: 2,
      name: 'Bob Agent',
      email: 'bob@example.com',
      password: 'password123',
      role: 'agent'
    }
  ];

  for (const user of users) {
    // Use upsert to avoid duplicate key errors if run multiple times
    await User.upsert(user);
  }

  const events = [
    {
      title: 'Pool Party',
      type: 'social',
      description: 'A fun pool party for all ages!',
      location: 'City Pool',
      date: new Date('2024-07-15T15:00:00'),
      budget: 500,
      created_by: 1,
      status: 'confirmed',
      is_self_planned: false,
      agent_id: 2,
      visibility: 'public',
      is_free: false,
      price: 20,
      attendees_count: 30,
      available_spots: 20
    },
    {
      title: 'Beach Festival',
      type: 'social',
      description: 'Enjoy music and games at the beach.',
      location: 'Sunny Beach',
      date: new Date('2024-08-01T12:00:00'),
      budget: 1000,
      created_by: 1,
      status: 'confirmed',
      is_self_planned: false,
      agent_id: 2,
      visibility: 'public',
      is_free: true,
      price: null,
      attendees_count: 100,
      available_spots: 50
    },
    {
      title: 'Sunset Yoga',
      type: 'social',
      description: 'Relax and unwind with sunset yoga.',
      location: 'Central Park',
      date: new Date('2024-07-20T18:30:00'),
      budget: 200,
      created_by: 1,
      status: 'confirmed',
      is_self_planned: true,
      agent_id: null,
      visibility: 'public',
      is_free: true,
      price: null,
      attendees_count: 15,
      available_spots: 10
    },
    {
      title: 'Dance Camp',
      type: 'social',
      description: 'A week-long dance camp for beginners.',
      location: 'Dance Studio',
      date: new Date('2024-09-10T10:00:00'),
      budget: 1500,
      created_by: 1,
      status: 'confirmed',
      is_self_planned: false,
      agent_id: 2,
      visibility: 'public',
      is_free: false,
      price: 100,
      attendees_count: 40,
      available_spots: 20
    }
  ];

  for (const event of events) {
    await Event.create(event);
  }

  console.log('Seeded events successfully!');
  process.exit();
}

seedEvents().catch((err) => {
  console.error('Error seeding events:', err);
  process.exit(1);
}); 