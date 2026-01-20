import { db } from '../db';

export async function seedTags() {

  await db.query(`
    CREATE TABLE tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category_id INT NOT NULL,
      UNIQUE (name, category_id),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  await db.query(`
    INSERT INTO tags (name, category_id) VALUES
      ('Kreativt skrivande', 1),
      ('Poesi', 1),
      ('Biografi', 1),
      ('Berättarteknik', 1),
      ('Literaturhistoria', 1),
      ('Textanalys', 1),
      ('Novellskrivande', 1),
      ('Bokcirkel', 1),
      ('Klassisk litteratur', 1),
      ('Översättning', 1),
    
      ('Rytm och takt', 2),
      ('Harmoni', 2),
      ('Melodilära', 2),
      ('Komposition', 2),
      ('Sångteknik', 2),
      ('Musikteori', 2),
      ('Låtanalys', 2),
      ('Rock', 2),
      ('Jazz', 2),
      ('Pop', 2),

      ('Orientering', 3),
      ('Ekologi', 3),
      ('Naturfotografering', 3),
      ('Vandring', 3),
      ('Naturskyddspolitik', 3),
      ('Bushcraft', 3),
      ('Fågelskådning', 3),
      ('Botanik', 3),
      ('Odling', 3),
      ('Skogsvård', 3),

      ('Programmering', 4),
      ('Webbutveckling', 4),
      ('Datasäkerhet', 4),
      ('Maskininlärning', 4),
      ('Dataanalys', 4),
      ('UX', 4),
      ('UI', 4),
      ('Robitik', 4),
      ('Artificiell intelligens', 4),
      ('Databashantering', 4),

      ('Grammatik', 5),
      ('Uttal', 5),
      ('Konversation', 5),
      ('Språkinlärning', 5),
      ('Språkhistoria', 5),
      ('Översättning', 5),
      ('Dialekter', 5),
      ('Flerspråkighet', 5),
      ('Språkteknologi', 5),
      ('Språkpolitik', 5),

      ('Kulturarv', 6),
      ('Skulptur', 6),
      ('Fotografi', 6),
      ('Teater', 6),
      ('Dans', 6),
      ('Arkitektur', 6),
      ('Konsthistoria', 6),
      ('Design', 6),
      ('Kulturpolitik', 6),
      ('Konstanalys', 6),

      ('Löpning', 7),
      ('Rehabilitering', 7),
      ('Yoga', 7),
      ('Mental träning', 7),
      ('Styrketräning', 7),
      ('Simning', 7),
      ('Bollspel', 7),
      ('Kost och näring', 7),
      ('Cykling', 7),
      ('Mindfulness', 7);
  `);
}