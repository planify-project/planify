const { Event, User } = require('../database');

const users = [
  {
    id: 1,
    name: 'Alice Organizer',
    email: 'alice@example.com',
    password: 'password123',
    role: 'organizer',
  },
  {
    id: 2,
    name: 'Bob Agent',
    email: 'bob@example.com',
    password: 'password123',
    role: 'agent',
  },
];

const publicEvents = [
  {
    name: 'Tunis Tech Summit 2024',
    type: 'conference',
    description: 'Annual technology conference featuring industry leaders and innovators.',
    startDate: new Date('2024-06-15T09:00:00'),
    endDate: new Date('2024-06-17T18:00:00'),
    location: 'Tunis Convention Center',
    latitude: 36.8065,
    longitude: 10.1815,
    created_by: 1,
    budget: 50000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 150,
    attendees_count: 500,
    available_spots: 200,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Sidi Bou Said Art Walk',
    type: 'art',
    description: 'Guided tour through the artistic streets of Sidi Bou Said.',
    startDate: new Date('2024-07-05T10:00:00'),
    endDate: new Date('2024-07-05T16:00:00'),
    location: 'Sidi Bou Said Village',
    latitude: 36.8717,
    longitude: 10.3417,
    created_by: 1,
    budget: 3000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: true,
    ticketPrice: null,
    attendees_count: 100,
    available_spots: 50,
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Hammamet Beach Yoga Festival',
    type: 'wellness',
    description: 'Weekend yoga retreat with beach sessions and meditation.',
    startDate: new Date('2024-07-20T08:00:00'),
    endDate: new Date('2024-07-21T18:00:00'),
    location: 'Hammamet Beach Resort',
    latitude: 36.4000,
    longitude: 10.6167,
    created_by: 1,
    budget: 15000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 120,
    attendees_count: 200,
    available_spots: 100,
    coverImage: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Nabeul Pottery Workshop',
    type: 'workshop',
    description: 'Learn traditional Tunisian pottery making techniques.',
    startDate: new Date('2024-08-10T09:00:00'),
    endDate: new Date('2024-08-10T17:00:00'),
    location: 'Nabeul Artisan Center',
    latitude: 36.4516,
    longitude: 10.7352,
    created_by: 1,
    budget: 2000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 45,
    attendees_count: 30,
    available_spots: 15,
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Bizerte Sailing Regatta',
    type: 'sports',
    description: 'Annual sailing competition in the Mediterranean.',
    startDate: new Date('2024-09-01T08:00:00'),
    endDate: new Date('2024-09-03T18:00:00'),
    location: 'Bizerte Marina',
    latitude: 37.2746,
    longitude: 9.8739,
    created_by: 1,
    budget: 25000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 75,
    attendees_count: 300,
    available_spots: 150,
    coverImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Tabarka Jazz Festival',
    type: 'music',
    description: 'International jazz festival in the coastal town of Tabarka.',
    startDate: new Date('2024-09-15T19:00:00'),
    endDate: new Date('2024-09-20T23:00:00'),
    location: 'Tabarka Amphitheatre',
    latitude: 36.9544,
    longitude: 8.7581,
    created_by: 1,
    budget: 35000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 90,
    attendees_count: 600,
    available_spots: 300,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Sousse Food & Wine Festival',
    type: 'food',
    description: 'Celebration of Tunisian cuisine and local wines.',
    startDate: new Date('2024-10-05T11:00:00'),
    endDate: new Date('2024-10-07T22:00:00'),
    location: 'Sousse Medina',
    latitude: 35.8245,
    longitude: 10.6346,
    created_by: 1,
    budget: 20000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 60,
    attendees_count: 400,
    available_spots: 200,
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Tunis International Film Festival',
    type: 'film',
    description: 'Celebrating cinema from the Arab world and beyond.',
    startDate: new Date('2024-11-01T14:00:00'),
    endDate: new Date('2024-11-07T23:00:00'),
    location: 'City of Culture, Tunis',
    latitude: 36.8065,
    longitude: 10.1815,
    created_by: 1,
    budget: 45000,
    status: 'approved',
    agent_id: 2,
    isPublic: true,
    is_free: false,
    ticketPrice: 80,
    attendees_count: 800,
    available_spots: 400,
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop',
  }
];

async function seedPublicEvents() {
  try {
    // First, clear existing events
    await Event.destroy({ where: {} });
    
    console.log('Seeding users...');
    for (const user of users) {
      await User.upsert(user);
    }

    console.log('Seeding public events...');
    for (const event of publicEvents) {
      await Event.create(event);
    }

    console.log('Public events seeded successfully!');
  } catch (error) {
    console.error('Error seeding public events:', error);
  }
}

seedPublicEvents();