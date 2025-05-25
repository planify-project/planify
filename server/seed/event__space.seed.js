const { EventSpace } = require('../database');
const { v4: uuidv4 } = require('uuid');

async function seedEventSpaces() {
  try {
    const spaces = [
      {
        id: uuidv4(),
        name: 'La Marsa Beach Resort',
        description: 'Luxurious beachfront venue with panoramic Mediterranean views',
        price: 3500.00,
        capacity: 400,
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
          'https://images.unsplash.com/photo-1601907478250-a039d5e14330',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed'
        ],
        location: 'La Marsa, Tunis',
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          beach_access: true,
          sound_system: true,
          outdoor_seating: true
        },
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Carthage Gardens',
        description: 'Historic venue surrounded by ancient ruins and lush gardens',
        price: 2800.00,
        capacity: 300,
        images: [
          'https://images.unsplash.com/photo-1464808322410-1a934aab61e5',
          'https://images.unsplash.com/photo-1517167685284-96a27681ad75',
          'https://images.unsplash.com/photo-1606744888344-493238951221'
        ],
        location: 'Carthage, Tunis',
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          garden: true,
          lighting: true,
          security: true
        },
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Sidi Bou Said Palace',
        description: 'Traditional Tunisian palace with stunning blue and white architecture',
        price: 4200.00,
        capacity: 250,
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
          'https://images.unsplash.com/photo-1515195641055-8b39b2ea2580'
        ],
        location: 'Sidi Bou Said, Tunis',
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          terrace: true,
          air_conditioning: true,
          historic_tours: true
        },
        isActive: true
      }
    ];

    await EventSpace.destroy({ where: {} });
    const createdSpaces = await EventSpace.bulkCreate(spaces);
    console.log(`Created ${createdSpaces.length} event spaces`);
    return createdSpaces;
  } catch (error) {
    console.error('Error seeding event spaces:', error);
    throw error;
  }
}

module.exports = seedEventSpaces; 