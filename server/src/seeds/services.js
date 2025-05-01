const services = [
  {
    id: 1,
    name: 'Pool Party',
    type: 'event',
    description: 'Enjoy a fun day at the pool with friends and family',
    price: 20,
    currency: 'DT',
    location: 'Les grottes, Bizerte',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    per: 'person',
    availableDates: ['2024-06-15', '2024-06-22', '2024-06-29']
  },
  {
    id: 2,
    name: 'Golden Palace',
    type: 'venue',
    description: 'Luxurious venue for special occasions',
    price: 175,
    currency: 'DT',
    location: 'Cite Hasan, Nabeul',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02c5',
    per: 'night',
    availableDates: ['2024-06-10', '2024-06-17', '2024-06-24']
  },
  {
    id: 3,
    name: 'Beach Outing',
    type: 'event',
    description: 'Relaxing day at the beach with various activities',
    price: 80,
    currency: 'DT',
    location: 'Coco beach Ghar El Milh, Bizerte',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    per: 'person',
    availableDates: ['2024-06-12', '2024-06-19', '2024-06-26']
  }
];

module.exports = services; 