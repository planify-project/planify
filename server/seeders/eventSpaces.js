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
        latitude: 36.8892,
        longitude: 10.3229,
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          beach_access: true,
          sound_system: true,
          outdoor_seating: true
        },
        rating: 4.8,
        status: 'available'
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
        latitude: 36.8526,
        longitude: 10.3284,
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          garden: true,
          lighting: true,
          security: true
        },
        rating: 4.7,
        status: 'available'
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
        latitude: 36.8711,
        longitude: 10.3414,
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          terrace: true,
          air_conditioning: true,
          historic_tours: true
        },
        rating: 4.9,
        status: 'available'
      },
      {
        id: uuidv4(),
        name: 'Hammamet Conference Center',
        description: 'Modern venue perfect for corporate events and conferences',
        price: 3200.00,
        capacity: 600,
        images: [
          'https://images.unsplash.com/photo-1587825140708-dfcdd712d627',
          'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e',
          'https://images.unsplash.com/photo-1526772662000-3f88f10405ff'
        ],
        location: 'Hammamet, Tunisia',
        latitude: 36.4000,
        longitude: 10.6167,
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          projector: true,
          stage: true,
          translation_booths: true,
          conference_rooms: true
        },
        rating: 4.6,
        status: 'available'
      },
      {
        id: uuidv4(),
        name: 'Djerba Luxury Resort',
        description: 'Island paradise venue with private beach access',
        price: 5000.00,
        capacity: 500,
        images: [
          'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
          'https://images.unsplash.com/photo-1540541338287-41700207dee6'
        ],
        location: 'Djerba, Tunisia',
        latitude: 33.8075,
        longitude: 10.8451,
        amenities: {
          wifi: true,
          parking: true,
          catering: true,
          spa: true,
          beach_access: true,
          pool: true,
          helipad: true
        },
        rating: 4.9,
        status: 'available'
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
