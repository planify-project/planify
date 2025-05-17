const seedEventSpaces = require('./eventSpaces');

const runSeeds = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Run event spaces seeder
    await seedEventSpaces();
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
};

// Run the seeds
runSeeds(); 