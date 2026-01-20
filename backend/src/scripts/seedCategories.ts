import { db } from '../db';

export async function seedCategories() {
  
  await db.query(`
    CREATE TABLE categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT
    );
  `);

  await db.query(`
    INSERT INTO categories (name, description)
    VALUES
      ('Litteratur och skrivande', '...'),
      ('Musik', '...'),
      ('Natur och friluftsliv', '...'),
      ('IT och teknik', '...'),
      ('Språk', '...'),
      ('Konst och kultur', '...'),
      ('Sport och träning', '...');
  `);
}