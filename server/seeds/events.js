'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const events = [
      {
        id: '1',
        name: 'Summer Wedding Celebration',
        type: 'wedding',
        startDate: '2024-07-15T16:00:00.000Z',
        endDate: '2024-07-15T23:00:00.000Z',
        location: 'Golden Palace, Cite Hasan, Nabeul',
        status: 'approved',
        created_by: '1',
        isPublic: true,
        budget: 5000,
        description: 'A beautiful summer wedding celebration with 200 guests',
        maxParticipants: 200,
        ticketPrice: 0,
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        services: [1, 2, 3],
        equipment: [4, 5]
      },
      {
        id: '2',
        name: 'Tech Conference 2024',
        type: 'conference',
        startDate: '2024-09-20T09:00:00.000Z',
        endDate: '2024-09-22T18:00:00.000Z',
        location: 'Modern Loft, Tunis City Center',
        status: 'pending',
        created_by: '1',
        isPublic: true,
        budget: 3000,
        description: 'Annual technology conference with workshops and networking',
        maxParticipants: 150,
        ticketPrice: 100,
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        services: [1, 2],
        equipment: [4, 5]
      },
      {
        id: '3',
        name: 'Corporate Team Building',
        type: 'corporate',
        startDate: '2024-08-10T10:00:00.000Z',
        endDate: '2024-08-10T17:00:00.000Z',
        location: 'Garden Oasis, La Marsa',
        status: 'approved',
        created_by: '1',
        isPublic: false,
        budget: 2000,
        description: 'Team building event for corporate employees',
        maxParticipants: 50,
        ticketPrice: 0,
        coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        services: [1, 3],
        equipment: [4]
      },
      {
        id: '4',
        name: 'Birthday Party',
        type: 'social',
        startDate: '2024-06-01T18:00:00.000Z',
        endDate: '2024-06-01T23:00:00.000Z',
        location: 'Royal Beach Club, Hammamet Beach',
        status: 'approved',
        created_by: '1',
        isPublic: true,
        budget: 1500,
        description: 'Birthday celebration with friends and family',
        maxParticipants: 30,
        ticketPrice: 0,
        coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        services: [1, 3],
        equipment: [4, 5]
      },
      {
        id: '5',
        name: 'Art Exhibition Opening',
        type: 'exhibition',
        startDate: '2024-10-05T18:00:00.000Z',
        endDate: '2024-10-05T22:00:00.000Z',
        location: 'Historic Villa, Sidi Bou Said',
        status: 'pending',
        created_by: '1',
        isPublic: true,
        budget: 2500,
        description: 'Opening night of contemporary art exhibition',
        maxParticipants: 100,
        ticketPrice: 50,
        coverImage: 'https://images.unsplash.com/photo-1536924940846-227afc31b2f7',
        services: [1, 2],
        equipment: [4, 5]
      }
    ];

    await queryInterface.bulkInsert('events', events, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('events', null, {});
  }
};