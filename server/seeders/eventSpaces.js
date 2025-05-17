const { EventSpace } = require('../database');

const eventSpaces = [
  {
    name: 'Grand Ballroom',
    description: 'Experience luxury at its finest in our Grand Ballroom. This magnificent venue features soaring ceilings, crystal chandeliers, and elegant marble floors. Perfect for weddings, galas, and corporate events. Our professional staff ensures every detail is perfect, from setup to cleanup. The space includes a built-in stage, professional sound system, and dedicated catering kitchen.',
    capacity: 500,
    price: 5000,
    location: 'Downtown',
    amenities: ['Stage', 'Dance Floor', 'Catering Kitchen', 'Parking', 'Crystal Chandelier', 'Marble Floors', 'Professional Sound System'],
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop'
    ],
    availability: true
  },
  {
    name: 'Garden Pavilion',
    description: 'Discover our enchanting Garden Pavilion, a perfect blend of natural beauty and elegant architecture. Surrounded by meticulously maintained gardens and blooming flowers, this venue offers a magical setting for outdoor weddings and summer events. The covered pavilion ensures your event can proceed rain or shine, while the romantic lighting creates an unforgettable atmosphere.',
    capacity: 200,
    price: 3000,
    location: 'City Park',
    amenities: ['Garden Area', 'Covered Pavilion', 'Restrooms', 'Lighting', 'Landscaping', 'Outdoor Kitchen', 'Bridal Suite'],
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'
    ],
    availability: true
  },
  {
    name: 'Modern Conference Center',
    description: 'Host your next corporate event in our state-of-the-art Conference Center. Designed for productivity and comfort, this venue features cutting-edge technology, flexible seating arrangements, and professional AV equipment. Perfect for conferences, seminars, and business meetings. Our dedicated team ensures seamless event execution.',
    capacity: 300,
    price: 4000,
    location: 'Business District',
    amenities: ['Projector', 'Sound System', 'WiFi', 'Catering Services', 'Breakout Rooms', 'Business Center', 'Video Conferencing'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
    ],
    availability: true
  },
  {
    name: 'Rooftop Terrace',
    description: 'Elevate your event at our stunning Rooftop Terrace. Enjoy breathtaking panoramic city views while hosting your special occasion. This modern venue features a stylish bar, comfortable seating areas, and ambient lighting. Perfect for cocktail parties, intimate gatherings, and sunset celebrations. Our professional staff ensures a memorable experience.',
    capacity: 150,
    price: 3500,
    location: 'City Center',
    amenities: ['Bar Area', 'Outdoor Seating', 'Heating', 'Lighting', 'City Views', 'DJ Booth', 'Catering Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    ],
    availability: true
  },
  {
    name: 'Historic Mansion',
    description: 'Step back in time at our beautifully restored Historic Mansion. This architectural gem features original details, grand staircases, and period furnishings. Perfect for elegant weddings, formal dinners, and cultural events. The venue includes a library, garden, and multiple event spaces. Create unforgettable memories in this timeless setting.',
    capacity: 250,
    price: 4500,
    location: 'Historic District',
    amenities: ['Grand Staircase', 'Garden', 'Parking', 'Catering Kitchen', 'Period Furnishings', 'Library', 'Bridal Suite'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    ],
    availability: true
  }
];

const seedEventSpaces = async () => {
  try {
    console.log('Seeding event spaces...');
    
    // Clear existing event spaces
    await EventSpace.destroy({ where: {} });
    
    // Insert new event spaces
    await EventSpace.bulkCreate(eventSpaces);
    
    console.log('Successfully seeded event spaces!');
  } catch (error) {
    console.error('Error seeding event spaces:', error);
  }
};

module.exports = seedEventSpaces; 