import { db } from '../db.js';

export async function seedNewCities() {
  try {
    const targetCities = [
      { name: 'Stockholm', latitude: 59.3293, longitude: 18.0686 },
      { name: 'Göteborg', latitude: 57.7089, longitude: 11.9746 },
      { name: 'Malmö', latitude: 55.605, longitude: 13.0038 }
    ];

    console.log('Inserting city data into new_cities (skipping duplicates)...');
    const placeholders = targetCities.map(() => '(?, ?, ?)').join(', ');
    const values = targetCities.flatMap((city) => [city.name, city.latitude, city.longitude]);
    await db.query(
      `INSERT IGNORE INTO new_cities (name, latitude, longitude) VALUES ${placeholders}`,
      values
    );

    const [result]: any = await db.query('SELECT COUNT(*) as count FROM new_cities');
    const cityCount = result[0].count;
    console.log(`✅ new_cities table ready with ${cityCount} cities`);
  } catch (err: any) {
    console.error('❌ Error seeding new_cities:', err.message);
    throw new Error(`Failed to seed new_cities: ${err.message}`);
  }
}
