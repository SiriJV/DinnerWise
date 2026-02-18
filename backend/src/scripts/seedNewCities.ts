import { db } from '../db.js';

export async function seedNewCities() {
  try {
    console.log('Creating new_cities table if it does not exist...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS new_cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        latitude DECIMAL(9,6) NOT NULL,
        longitude DECIMAL(9,6) NOT NULL
      );
    `);

    console.log('Inserting city data into new_cities (skipping duplicates)...');
    await db.query(`
      INSERT IGNORE INTO new_cities (name, latitude, longitude) VALUES
        ('Stockholm', 59.3293, 18.0686),
        ('Göteborg', 57.7089, 11.9746),
        ('Malmö', 55.6050, 13.0038),
        ('Uppsala', 59.8586, 17.6389),
        ('Västerås', 59.6099, 16.5448),
        ('Örebro', 59.2741, 15.2066),
        ('Linköping', 58.4108, 15.6214),
        ('Helsingborg', 56.0465, 12.6945),
        ('Jönköping', 57.7826, 14.1618),
        ('Norrköping', 58.5877, 16.1924),
        ('Lund', 55.7047, 13.1910),
        ('Umeå', 63.8258, 20.2630),
        ('Gävle', 60.6749, 17.1413),
        ('Borås', 57.7210, 12.9401),
        ('Södertälje', 59.1955, 17.6253),
        ('Eskilstuna', 59.3713, 16.5098),
        ('Halmstad', 56.6745, 12.8568),
        ('Växjö', 56.8777, 14.8091),
        ('Karlstad', 59.3793, 13.5036),
        ('Sundsvall', 62.3908, 17.3069),
        ('Östersund', 63.1792, 14.6357),
        ('Trollhättan', 58.2837, 12.2886),
        ('Luleå', 65.5848, 22.1547),
        ('Kalmar', 56.6634, 16.3568),
        ('Skövde', 58.3913, 13.8451),
        ('Falun', 60.6036, 15.6250),
        ('Kristianstad', 56.0294, 14.1567),
        ('Karlskrona', 56.1612, 15.5869),
        ('Skellefteå', 64.7507, 20.9509),
        ('Varberg', 57.1056, 12.2508),
        ('Uddevalla', 58.3498, 11.9350),
        ('Ystad', 55.4295, 13.8204),
        ('Motala', 58.5370, 15.0375),
        ('Täby', 59.4439, 18.0687),
        ('Sollentuna', 59.4280, 17.9509),
        ('Upplands Väsby', 59.5184, 17.9113),
        ('Tumba', 59.1986, 17.8332),
        ('Lidingö', 59.3662, 18.1336),
        ('Märsta', 59.6216, 17.8546),
        ('Alingsås', 57.9300, 12.5330),
        ('Landskrona', 55.8708, 12.8301),
        ('Trelleborg', 55.3751, 13.1569),
        ('Enköping', 59.6350, 17.0778),
        ('Åkersberga', 59.4794, 18.2997),
        ('Kungälv', 57.8730, 11.9800),
        ('Sandviken', 60.6167, 16.7750),
        ('Nyköping', 58.7530, 17.0079),
        ('Visby', 57.6348, 18.2948),
        ('Katrineholm', 58.9950, 16.2072),
        ('Kiruna', 67.8558, 20.2253)
    `);

    const [result]: any = await db.query('SELECT COUNT(*) as count FROM new_cities');
    const cityCount = result[0].count;
    console.log(`✅ new_cities table ready with ${cityCount} cities`);
  } catch (err: any) {
    console.error('❌ Error seeding new_cities:', err.message);
    throw new Error(`Failed to seed new_cities: ${err.message}`);
  }
}
