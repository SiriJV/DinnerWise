import dotenv from 'dotenv';
import { db } from '../db.js';
dotenv.config();

const LETTERS = ['a', 'e', 'r', 's', 't'];
const CITY_NAMES = ['Stockholm', 'Göteborg', 'Malmö'];
const DELAY_MS = 1000;

const API_KEY = process.env.TRIPADVISOR_API_KEY;
if (!API_KEY) {
  throw new Error('Missing TRIPADVISOR_API_KEY');
}

interface TripAdvisorAddress {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalcode?: string;
  address_string?: string;
}

interface TripAdvisorRestaurant {
  location_id: string | number;
  name: string;
  distance?: string;
  bearing?: string;
  address_obj?: TripAdvisorAddress;
}

interface TripAdvisorSearchResponse {
  data: TripAdvisorRestaurant[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

async function createTripadvisorTable() {
  console.log('Recreating tripadvisor_restaurants table...');
  await db.query('DROP TABLE IF EXISTS tripadvisor_restaurants');
  await db.query(`
    CREATE TABLE IF NOT EXISTS tripadvisor_restaurants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      location_id VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      city VARCHAR(100),
      address_string VARCHAR(255),
      postalcode VARCHAR(20),
      latitude DECIMAL(9,6),
      longitude DECIMAL(9,6),
      phone_number VARCHAR(50),
      website_url VARCHAR(255),
      photos TEXT
    );
  `);
}

export async function seedTripadvisorBasic() {
  let totalInserted = 0;

  let dbCities: any[] = [];
  try {
    const [rows]: any = await db.query(`SELECT id, name, latitude, longitude FROM new_cities`);
    dbCities = rows;

    const cityLookup = new Set(CITY_NAMES.map((name) => name.toLowerCase()));
    dbCities = dbCities.filter((city) => cityLookup.has(city.name.toLowerCase()));

    console.log(`✅ Loaded ${dbCities.length} cities from new_cities table`);
  } catch (err) {
    console.error('❌ Failed to load cities from database:', err);
    throw new Error('Cannot fetch cities from new_cities table. Make sure seedNewCities() was run first.');
  }

  await createTripadvisorTable();

  for (const city of dbCities) {
    console.log(`\n🌆 Fetching restaurants for city: ${city.name}`);
    const coords = `${city.latitude},${city.longitude}`;
    const uniqueRestaurants = new Map<string, TripAdvisorRestaurant>();

    for (const letter of LETTERS) {
      console.log(`  🔍 Searching with letter: ${letter}`);
      try {
        const response = await fetch(
          `https://api.content.tripadvisor.com/api/v1/location/search?key=${API_KEY}&searchQuery=${letter}&category=restaurants&latLong=${coords}&radius=20&radiusUnit=km&language=sv`
        );

        if (!response.ok) {
          console.warn(`    ⚠️ API request failed for letter ${letter}: ${response.status}`);
          continue;
        }

        const data = (await response.json()) as TripAdvisorSearchResponse;

        for (const r of data.data || []) {
          uniqueRestaurants.set(String(r.location_id), r);
        }

        if (DELAY_MS > 0) {
          await new Promise((res) => setTimeout(res, DELAY_MS));
        }
      } catch (err) {
        console.error(`    ❌ Error fetching letter ${letter}:`, err);
      }
    }

    console.log(`  📝 Found ${uniqueRestaurants.size} unique restaurants for ${city.name}`);

    for (const restaurant of uniqueRestaurants.values()) {
      try {
        await db.query(`
          INSERT INTO tripadvisor_restaurants
            (location_id, name, city, address_string, postalcode)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            city = VALUES(city),
            address_string = VALUES(address_string),
            postalcode = VALUES(postalcode)
        `, [
          restaurant.location_id,
          restaurant.name,
          city.name,
          restaurant.address_obj?.address_string || null,
          restaurant.address_obj?.postalcode || null
        ]);

        totalInserted++;
      } catch (err) {
        console.error(`    ❌ Failed to insert ${restaurant.name}:`, err);
      }
    }
  }

  console.log(`\n✅ Basic seed complete. Total inserted: ${totalInserted}`);
  return { message: 'Basic seed complete', totalInserted };
}