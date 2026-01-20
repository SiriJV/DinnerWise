import { db } from '../db';

export async function seedEvents() {
  
  await db.query(`
    CREATE TABLE events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category_id INT NOT NULL,
      restaurant_id INT NOT NULL,
      current_participants INT NOT NULL DEFAULT 0,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  await db.query(`
    INSERT INTO events 
      (title, description, category_id, restaurant_id, current_participants, price, date, start_time, end_time)
    VALUES
      ('Kreativt skrivande workshop', 'Lär dig skriva kreativt med övningar.', 1, 1, 3, 200, '2026-03-01', '17:00:00', '19:00:00'),
      ('Poesikväll', 'Diskutera poesi och skriv egna dikter.', 1, 1, 5, 100, '2026-03-05', '18:00:00', '20:00:00'),
      ('Berättarteknik för nybörjare', 'Lär dig grunderna i berättarteknik.', 1, 1, 2, 150, '2026-03-10', '16:00:00', '18:00:00'),
      ('Novellskrivar-cirkel', 'Skriv och diskutera noveller i grupp.', 1, 2, 4, 180, '2026-03-15', '17:30:00', '19:30:00'),
      ('Literaturhistoria föreläsning', 'En resa genom litteraturens historia.', 1, 2, 6, 220, '2026-03-20', '18:00:00', '20:00:00'),

      ('Grundläggande musikteori', 'Lär dig grunderna i musikteori.', 2, 2, 3, 250, '2026-04-01', '17:00:00', '19:00:00'),
      ('Jazzimprovisation', 'Improvisera med jazzskalan.', 2, 2, 5, 300, '2026-04-05', '18:00:00', '20:00:00'),
      ('Sångteknik workshop', 'Utveckla din sångröst.', 2, 3, 4, 350, '2026-04-10', '16:00:00', '18:00:00'),
      ('Kompositionskurs', 'Lär dig komponera musik.', 2, 3, 6, 400, '2026-04-15', '17:30:00', '19:30:00'),
      ('Musikanalys seminarie', 'Analysera olika musikstycken.', 2, 3, 7, 280, '2026-04-20', '18:00:00', '20:00:00'),

      ('Vandring i skogen', 'Utforska skogen och lär dig om naturen.', 3, 4, 5, 100, '2026-05-01', '09:00:00', '12:00:00'),
      ('Fågelskådning för nybörjare', 'Lär dig känna igen fåglar.', 3, 4, 3, 150, '2026-05-05', '07:00:00', '10:00:00'),
      ('Bushcraft-kurs', 'Grundläggande överlevnadstekniker.', 3, 4, 6, 350, '2026-05-10', '10:00:00', '15:00:00'),
      ('Botanikworkshop', 'Lär dig om växter och blommor.', 3, 5, 4, 200, '2026-05-15', '13:00:00', '16:00:00'),
      ('Naturfotografering', 'Fotografera naturen på bästa sätt.', 3, 5, 7, 250, '2026-05-20', '14:00:00', '18:00:00'),

      ('Introduktion till programmering', 'Lär dig grunderna i programmering.', 4, 5, 8, 300, '2026-06-01', '17:00:00', '20:00:00'),
      ('Datasäkerhet för alla', 'Så skyddar du din data online.', 4, 6, 5, 220, '2026-06-05', '18:00:00', '20:00:00'),
      ('Maskininlärning 101', 'Grunderna i AI och ML.', 4, 6, 4, 400, '2026-06-10', '16:00:00', '19:00:00'),
      ('Webbutveckling med React', 'Bygg webbappar med React.', 4, 6, 6, 350, '2026-06-15', '17:30:00', '20:30:00'),
      ('Databashantering', 'Lär dig SQL och databaser.', 4, 6, 7, 280, '2026-06-20', '18:00:00', '20:00:00'),

      ('Spansk konversationskväll', 'Öva spanska i avslappnad miljö.', 5, 1, 8, 150, '2026-07-01', '18:00:00', '20:00:00'),
      ('Fransk grammatik workshop', 'Förbättra din franska grammatik.', 5, 1, 4, 200, '2026-07-05', '17:00:00', '19:00:00'),
      ('Uttalsträning engelska', 'Träna på rätt uttal.', 5, 1, 3, 100, '2026-07-10', '16:00:00', '18:00:00'),
      ('Konversation på tyska', 'Öva att prata tyska.', 5, 2, 6, 180, '2026-07-15', '17:30:00', '19:30:00'),
      ('Svenska för nybörjare', 'Lär dig svenska från grunden.', 5, 2, 5, 220, '2026-07-20', '18:00:00', '20:00:00'),

      ('Fotografi workshop', 'Lär dig grunderna i fotografering.', 6, 2, 7, 250, '2026-08-01', '17:00:00', '19:00:00'),
      ('Skulpturkurs', 'Skapa konst i lera.', 6, 2, 3, 300, '2026-08-05', '18:00:00', '20:00:00'),
      ('Teaterimprovisation', 'Lär dig improvisera på scen.', 6, 3, 4, 350, '2026-08-10', '16:00:00', '18:00:00'),
      ('Danskurs', 'Lär dig olika dansstilar.', 6, 3, 6, 400, '2026-08-15', '17:30:00', '19:30:00'),
      ('Konsthistoria föreläsning', 'Upptäck konsthistoriens värld.', 6, 3, 7, 280, '2026-08-20', '18:00:00', '20:00:00'),

      ('Löpning för nybörjare', 'Kom igång med löpning.', 7, 4, 5, 100, '2026-09-01', '07:00:00', '08:00:00'),
      ('Yoga och mindfulness', 'Träna kropp och själ.', 7, 4, 3, 150, '2026-09-05', '18:00:00', '19:00:00'),
      ('Styrketräning grundkurs', 'Bygg styrka på rätt sätt.', 7, 4, 6, 350, '2026-09-10', '17:00:00', '19:00:00'),
      ('Cyklingstur', 'Upptäck naturen på cykel.', 7, 5, 4, 200, '2026-09-15', '09:00:00', '12:00:00'),
      ('Simning för alla', 'Simteknik och vattenvana.', 7, 5, 7, 250, '2026-09-20', '16:00:00', '18:00:00');
  `);

  await db.query(`
    CREATE TABLE event_tags (
      event_id INT NOT NULL,
      tag_id INT NOT NULL,
      PRIMARY KEY (event_id, tag_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  await db.query(`
    INSERT INTO event_tags (event_id, tag_id) VALUES
      (1, 1), (1, 2), (1, 3),       
      (2, 4), (2, 5), (3, 6), 
      (3, 7), (4, 8), (4, 9),
      (5, 10),

      (6, 11), (6, 12), (7, 13),
      (7, 14), (8, 15), (8, 16),
      (9, 17), (9, 18), (10, 19),

      (11, 20), (11, 21), (12, 22),
      (12, 23), (13, 24), (13, 25),
      (14, 26), (14, 27), (15, 28),

      (16, 29), (16, 30), (17, 31),
      (17, 32), (18, 33), (18, 34),
      (19, 35), (19, 36), (20, 37),

      (21, 38), (21, 39), (22, 40),
      (22, 41), (23, 42), (23, 43),
      (24, 44), (24, 45), (25, 46),

      (26, 47), (26, 48), (27, 49),
      (27, 48), (28, 48), (28, 49),
      (29, 48), (29, 49), (30, 48),
      (30, 49);
      `);
}