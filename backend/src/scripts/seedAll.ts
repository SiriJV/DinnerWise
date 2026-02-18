import { seedCategories } from './seedCategories.js';
import { seedTags } from './seedTags.js';
import { seedTripadvisorBasic } from './seedTripadvisor.js';
import { seedEvents } from './seedEvents.js';
import { seedUsers } from './seedUsers.js';
import { seedNewCities } from './seedNewCities.js';
import { db } from '../db.js';

async function dropTables() {
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query('DROP TABLE IF EXISTS user_followed_tags');
  await db.query('DROP TABLE IF EXISTS user_events_saved');
  await db.query('DROP TABLE IF EXISTS user_events_participating');
  await db.query('DROP TABLE IF EXISTS event_tags');
  await db.query('DROP TABLE IF EXISTS events');
  await db.query('DROP TABLE IF EXISTS tags');
  await db.query('DROP TABLE IF EXISTS new_cities');
  await db.query('DROP TABLE IF EXISTS tripadvisor_restaurants');
  // Old tables (no longer used)
  await db.query('DROP TABLE IF EXISTS restaurant_opening_hours');
  await db.query('DROP TABLE IF EXISTS restaurants');
  await db.query('DROP TABLE IF EXISTS cities'); // Completely removed - use new_cities
  await db.query('DROP TABLE IF EXISTS categories'); 
}

async function seedAll() {
  try {
    await dropTables();

    console.log('Seeding users...');
    await seedUsers();

    console.log('Seeding categories...');
    await seedCategories();

    console.log('Seeding tags...');
    await seedTags();
    
    console.log('Seeding new_cities...');
    await seedNewCities();

    console.log('Seeding tripadvisor restaurants...');
    await seedTripadvisorBasic();

    console.log('Seeding events...');
    await seedEvents();

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedAll();