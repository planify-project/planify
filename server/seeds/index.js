const { sequelize } = require('../database');
const seedEventSpaces = require('./eventSpaces');

async function runAllSeeds() {
  try {
    // Sync database tables
    await sequelize.sync({ force: true });
    console.log('Database tables synced');

    // Run event spaces seeder
    await seedEventSpaces();
    
    console.log('All seeds completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runAllSeeds();