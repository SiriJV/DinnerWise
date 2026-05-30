import { seedCategories } from './seedCategories.js';
import { seedTags } from './seedTags.js';
import { seedTripadvisorBasic } from './seedTripadvisor.js';
import { seedTripadvisorDetails } from './seedTripadvisorDetails.js';
import { seedEvents } from './seedEvents.js';
import { seedUsers } from './seedUsers.js';
import { seedNewCities } from './seedNewCities.js';
import { db } from '../db.js';

async function clearTables() {
  const connection = await db.getConnection();
  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE event_tags');
    await connection.query('TRUNCATE TABLE events');
    await connection.query('TRUNCATE TABLE tags');
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('TRUNCATE TABLE tripadvisor_restaurants');
    await connection.query('TRUNCATE TABLE new_cities');
    await connection.query('TRUNCATE TABLE user_reports');
    await connection.query('TRUNCATE TABLE event_reports');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    connection.release();
  }
}

async function seedAll() {
  try {
    await clearTables();

    console.log('Seeding users...');
    await seedUsers();

    console.log('Seeding categories...');
    await seedCategories();

    console.log('Seeding tags...');
    await seedTags();
    
    console.log('Seeding new_cities...');
    await seedNewCities();

    console.log('Seeding tripadvisor restaurants (3 cities)...');
    await seedTripadvisorBasic();
    console.log('Seeding tripadvisor details (images, limited)...');
    await seedTripadvisorDetails();

    const [countRows]: any = await db.query(
      'SELECT COUNT(*) as count FROM tripadvisor_restaurants'
    );
    const restaurantCount = countRows?.[0]?.count ?? 0;
    if (restaurantCount > 0) {
      console.log('Seeding events (templates)...');
      await seedEvents();
    } else {
      console.log('Skipping events seed (no restaurants available).');
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedAll();