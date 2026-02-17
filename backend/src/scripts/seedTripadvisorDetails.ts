import dotenv from 'dotenv';
import { db } from '../db.js';
dotenv.config();

const API_KEY = process.env.TRIPADVISOR_API_KEY;
if (!API_KEY) throw new Error('Missing TRIPADVISOR_API_KEY');

export async function seedTripadvisorDetails() {
  console.log('Fetching all restaurants for detail update...');
  const [restaurants]: any = await db.query(`SELECT location_id, name FROM tripadvisor_restaurants`);
  let totalUpdated = 0;

  for (const r of restaurants) {
    try {
      console.log(`\n📌 Fetching details for: ${r.name} (ID: ${r.location_id})`);

      const detailsResponse = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/${r.location_id}/details?key=${API_KEY}&language=sv`
      );

      if (!detailsResponse.ok) {
        const body = await detailsResponse.text();
        console.warn(`  ⚠️ Details fetch failed: status=${detailsResponse.status} body=${body}`);
        continue;
      }

      const detailsData = await detailsResponse.json() as any;

      const latitude = detailsData.latitude ?? detailsData.address_obj?.latitude ?? null;
      const longitude = detailsData.longitude ?? detailsData.address_obj?.longitude ?? null;
      const phone = detailsData.phone ?? null;
      const website = detailsData.website ?? null;

      const photosResponse = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/${r.location_id}/photos?key=${API_KEY}&language=sv`
      );

      let photoUrls: string[] = [];

      if (photosResponse.ok) {
        const photosData = await photosResponse.json() as { data: any[] };
        photoUrls = photosData.data
          .map(p => p.images?.original?.url || p.images?.medium?.url)
          .filter(Boolean);
      } else {
        console.warn(`  ⚠️ Photos fetch failed for ${r.location_id}: ${photosResponse.status}`);
      }

      await db.query(`
        UPDATE tripadvisor_restaurants
        SET latitude = ?, longitude = ?, phone_number = ?, website_url = ?, photos = ?
        WHERE location_id = ?
      `, [
        latitude,
        longitude,
        phone,
        website,
        JSON.stringify(photoUrls),
        r.location_id
      ]);

      console.log(`  ✅ Updated details for ${r.name}`);
      totalUpdated++;

      await new Promise(res => setTimeout(res, 1500));

    } catch (err) {
      console.error(`  ❌ Failed for location_id ${r.location_id}:`, err);
    }
  }

  console.log(`\n✅ Details seed complete. Total updated: ${totalUpdated}`);
}

if (process.argv[1].includes('seedTripadvisorDetails')) {
  seedTripadvisorDetails().catch(console.error);
}