'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const services = [
      {
        id: '1',
        name: 'Premium Catering Service',
        description: 'High-end catering service with international cuisine',
        price: 1500,
        type: 'service',
        images: [
          'https://images.unsplash.com/photo-1555244162-803834f70033',
          'https://images.unsplash.com/photo-1555244162-803834f70033'
        ],
        location: 'Tunis',
        amenities: {
          international_cuisine: true,
          vegetarian_options: true,
          dessert_service: true,
          beverage_service: true
        },
        availability: {
          monday: '08:00-22:00',
          tuesday: '08:00-22:00',
          wednesday: '08:00-22:00',
          thursday: '08:00-22:00',
          friday: '08:00-23:00',
          saturday: '08:00-23:00',
          sunday: '08:00-22:00'
        }
      },
      {
        id: '2',
        name: 'Professional Photography',
        description: 'Professional event photography and videography',
        price: 800,
        type: 'service',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
        ],
        location: 'Tunis',
        amenities: {
          photo_editing: true,
          drone_photography: true,
          video_coverage: true,
          same_day_delivery: true
        },
        availability: {
          monday: '09:00-20:00',
          tuesday: '09:00-20:00',
          wednesday: '09:00-20:00',
          thursday: '09:00-20:00',
          friday: '09:00-21:00',
          saturday: '09:00-21:00',
          sunday: '09:00-20:00'
        }
      },
      {
        id: '3',
        name: 'Live Band Entertainment',
        description: 'Professional live music band for events',
        price: 1200,
        type: 'service',
        images: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'
        ],
        location: 'Tunis',
        amenities: {
          custom_playlist: true,
          sound_system: true,
          multiple_genres: true,
          backup_singers: true
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
        id: '4',
        name: 'Professional Sound System',
        description: 'High-quality sound system for events',
        price: 500,
        type: 'equipment',
        images: [
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89',
          'https://images.unsplash.com/photo-1571330735066-03aaa9429d89'
        ],
        location: 'Tunis',
        amenities: {
          wireless_microphones: true,
          mixing_board: true,
          speakers: true,
          technical_support: true
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
        id: '5',
        name: 'Professional Lighting Setup',
        description: 'Professional lighting equipment for events',
        price: 600,
        type: 'equipment',
        images: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'
        ],
        location: 'Tunis',
        amenities: {
          spotlights: true,
          color_lights: true,
          fog_machine: true,
          technical_support: true
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
      }
    ];

    await queryInterface.bulkInsert('services', services, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('services', null, {});
  }
}; 