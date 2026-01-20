import { db } from '../db';

export async function seedRestaurants() {
  
  await db.query(`
    CREATE TABLE restaurants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      city VARCHAR(100),
      latitude DECIMAL(9,6),
      longitude DECIMAL(9,6),
      phone_number VARCHAR(20),
      website_url VARCHAR(255)
    );
  `);

  await db.query(`
    CREATE TABLE restaurant_opening_hours (
      id INT AUTO_INCREMENT PRIMARY KEY,
      restaurant_id INT NOT NULL,
      day_of_week TINYINT NOT NULL,
      open_time TIME,
      close_time TIME,
      is_closed BOOLEAN DEFAULT false,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
        ON DELETE CASCADE
    );
  `);

  await db.query(`
    INSERT INTO restaurants (name, address, city, latitude, longitude, phone_number, website_url) VALUES
    ('Ved House', 'Vintergatan 2', 'Alingsås', 59.3175, 18.0560, NULL, 'https://vedhouse.se/'),
    ('Högsjö Wärdshus', 'Norra Ökna', 'Arboga', 59.8586, 17.6389, NULL, 'https://hogsjowardshus.se/'),
    ('Olssons Brygga', 'Arvika Hamn', 'Arvika', 57.7089, 11.9746, NULL, 'https://olssonsbrygga.se/'),
    ('Casa Mia', 'Storgatan 25', 'Askersund', 57.7089, 11.9746, NULL, NULL),
    ('Burning Duck', 'Kungsgatan 21', 'Avesta', 59.3175, 18.0560, NULL, NULL),
    ('Dg11', 'Drottninggatan 11', 'Boden', 59.8586, 17.6389, NULL, 'https://dg11.se/'),
    ('Växbo Krog', 'Växbo 2924', 'Bollnäs', 57.7089, 11.9746, NULL, NULL),
    ('Lundgrens Garage', 'Köpmangatan 18', 'Borgholm', 57.7089, 11.9746, NULL, 'https://lundgrensgarage.se/'),
    ('Äteriet', 'Hantverksbyn 1', 'Borlänge', 59.3175, 18.0560, NULL, 'https://ateriet.se/'),
    ('Vinci', 'Sandwallsplats 7A', 'Borås', 59.8586, 17.6389, NULL, 'https://www.vincivinci.se/'),
    ('Victoria', 'Köpmansgatan 5', 'Båstad', 57.7089, 11.9746, NULL, 'https://www.victoriabastad.se/'),
    ('Texas Corner', 'Bålstavägen 13', 'Bålsta', 57.7089, 11.9746, NULL, 'http://texascorner.se/'),
    ('Putte Kock', 'Kaserngatan 18', 'Eksjö', 57.7089, 11.9746, NULL, 'https://puttekock.se/'),
    ('Enoteca Rådhusbacken', 'Rådhusgatan 4', 'Enköping', 57.7089, 11.9746, NULL, 'https://enotecaradhusbacken.se/'),
    ('Jernberghska', 'Rademachergatan 48', 'Eskilstuna', 59.3175, 18.0560, NULL, 'https://www.jernberghska.se/'),
    ('Yun Lee', 'Bryggaregatan 1', 'Eslöv', 59.8586, 17.6389, NULL, 'https://www.yunlee.se/'),
    ('1Hus2Man', 'Fantholmsvägen 14B', 'Ekerö', 57.7089, 11.9746, NULL, NULL),
    ('Brinell Lebanese Grill', 'Brinellvägen 7', 'Fagersta', 57.7089, 11.9746, NULL, NULL),
    ('Lilla Napoli', 'Halmstadvägen 1', 'Falkenberg', 57.7089, 11.9746, NULL, 'https://www.lillanapoli.se/'),
    ('Plantis Kök & Bar', 'Sankt Olofsgatan 23', 'Falköping', 57.7089, 11.9746, NULL, NULL),
    ('Banken Bar & Brasserie', 'Asgatan 41', 'Falun', 59.3175, 18.0560, NULL, 'https://bankenfalun.se/bbb-startsida/'),
    ('Verovin', 'Norra Kungsgatan 11', 'Gävle', 59.8586, 17.6389, NULL, 'https://verovin.se/'),
    ('Barrique', 'Berzeliigatan 18', 'Göteborg', 57.7089, 11.9746, NULL, 'https://www.barrique.nu/'),
    ('Zigges Garage', 'Hamngatan 45', 'Halmstad', 57.7089, 11.9746, NULL, 'https://ziggesgarage.se/'),
    ('Hulkoffgården', 'Korpikylä 197', 'Haparanda', 57.7089, 11.9746, NULL, 'https://www.hulkoff.se/restaurang.html'),
    ('Yoko', 'Järnvägsgatan 3', 'Helsingborg', 57.7089, 11.9746, NULL, 'https://www.yokodinnerclub.se/'),
    ('Medelhavskällaren', 'Norra Kyrkogatan 9C', 'Hudiksvall', 59.3175, 18.0560, NULL, NULL),
    ('Harrys Hässleholm', 'Järnvägsgatan 21', 'Hässleholm', 59.8586, 17.6389, NULL, 'https://harrys.se/sv-se/haessleholm/'),
    ('Chako Mat & Dryck', 'Storgatan 62', 'Höganäs', 57.7089, 11.9746, NULL, 'https://www.chako.se/'),
    ('Jungle Thai', 'Trädgårdsgatan 9', 'Jönköping', 57.7089, 11.9746, NULL, 'https://www.junglethai.com/'),
    ('Pizzeria Katrine', 'Katrinedalsgatan 10', 'Karlskoga', 59.3175, 18.0560, NULL, 'https://katrinedalskrogen.se/'),
    ('Restaurang Montmartre', 'Ronnebygatan 18', 'Karlskrona', 59.8586, 17.6389, NULL, 'https://www.montmartre.se/'),
    ('Barón', 'Tingvallagatan 13', 'Karlstad', 57.7089, 11.9746, NULL, 'https://www.baronkarlstad.se/'),
    ('Lotus Garden', 'Vasavägen 9', 'Katrineholm', 57.7089, 11.9746, NULL, NULL),
    ('Restaurang Smaca', 'Cardellsgatan 13', 'Kristianstad', 57.7089, 11.9746, NULL, 'https://www.smaca.se/'),
    ('Oliveriet', 'Kungsgatan 48', 'Kristinehamn', 57.7089, 11.9746, NULL, 'https://oliveriet.se/'),
    ('Restaurant Simone', 'Köpmangatan 26', 'Kumla', 59.3175, 18.0560, NULL, NULL),
    ('Restaurang Ester', 'Norra Torggatan 4', 'Kungsbacka', 59.8586, 17.6389, NULL, 'https://www.restaurangester.se/'),
    ('Casa Nostra Due', 'Drottninggatan 13', 'Kungsör', 57.7089, 11.9746, NULL, NULL),
    ('August Bistro & Co', 'Västra Gatan 62', 'Kungälv', 57.7089, 11.9746, NULL, 'https://augustbistro.wixsite.com/augustbistro'),
    
    ('Restaurang Smaca', 'Cardellsgatan 13', 'Kristianstad', 57.7089, 11.9746, NULL, 'https://www.smaca.se/'),
    ('Oliveriet', 'Kungsgatan 48', 'Kristinehamn', 57.7089, 11.9746, NULL, 'https://oliveriet.se/'),
    ('Restaurant Simone', 'Köpmangatan 26', 'Kumla', 59.3175, 18.0560, NULL, NULL),
    ('Restaurang Ester', 'Norra Torggatan 4', 'Kungsbacka', 59.8586, 17.6389, NULL, 'https://www.restaurangester.se/'),
    ('Casa Nostra Due', 'Drottninggatan 13', 'Kungsör', 57.7089, 11.9746, NULL, NULL),
    ('August Bistro & Co', 'Västra Gatan 62', 'Kungälv', 57.7089, 11.9746, NULL, 'https://augustbistro.wixsite.com/augustbistro');
    
    `);
    
  await db.query(`
    INSERT INTO restaurant_opening_hours
    (restaurant_id, day_of_week, open_time, close_time, is_closed)
    VALUES
    -- Café Español
    (1, 1, '10:00', '22:00', false),
    (1, 2, '10:00', '22:00', false),
    (1, 3, '10:00', '22:00', false),
    (1, 4, '10:00', '22:00', false),
    (1, 5, '10:00', '22:00', false),
    (1, 6, '12:00', '23:00', false),
    (1, 7, '12:00', '23:00', false),

    -- La Trattoria
    (2, 1, '11:00', '23:00', false),
    (2, 2, '11:00', '23:00', false),
    (2, 3, '11:00', '23:00', false),
    (2, 4, '11:00', '23:00', false),
    (2, 5, '11:00', '23:00', false),
    (2, 6, '11:00', '23:00', false),
    (2, 7, '11:00', '23:00', false),

    -- Solsken (closed Sat–Sun)
    (3, 1, '11:00', '21:00', false),
    (3, 2, '11:00', '21:00', false),
    (3, 3, '11:00', '21:00', false),
    (3, 4, '11:00', '21:00', false),
    (3, 5, '11:00', '21:00', false),
    (3, 6, NULL, NULL, true),
    (3, 7, NULL, NULL, true);
  `);
}