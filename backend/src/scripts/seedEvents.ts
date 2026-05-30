import { db } from '../db.js';

export async function seedEvents() {
  console.log('SEED EVENTS STARTED');
  // Nedan behövs för att kunna seeda just denna fil (även sista raderna i filen)
  // await db.query('DROP TABLE IF EXISTS event_tags');
  // await db.query('DROP TABLE IF EXISTS events');
  const connection = await db.getConnection();
  try {
    await connection.query('DELETE FROM event_tags');
    await connection.query('DELETE FROM events');

    await connection.query('DROP TEMPORARY TABLE IF EXISTS event_templates');
    await connection.query(`
      CREATE TEMPORARY TABLE event_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT NOT NULL,
        restaurant_slot INT NOT NULL,
        current_participants INT NOT NULL DEFAULT 0,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL
      );
    `);

    await connection.query(`    INSERT INTO event_templates 
      (title, description, category_id, restaurant_slot, current_participants, price, date, start_time, end_time)
    VALUES
      ('Kreativt skrivande workshop', 'Lär dig skriva kreativt med övningar.', 1, 22, 3, 200, '2026-03-01', '17:00:00', '19:00:00'),
      ('Poesikväll', 'Diskutera poesi och skriv egna dikter.', 1, 1, 4, 100, '2026-03-05', '18:00:00', '20:00:00'),
      ('Berättarteknik för nybörjare', 'Lär dig grunderna i berättarteknik.', 1, 154, 2, 150, '2026-03-10', '16:00:00', '18:00:00'),
      ('Novellskrivar-cirkel', 'Skriv och diskutera noveller i grupp.', 1, 2, 4, 180, '2026-03-15', '17:30:00', '19:30:00'),
      ('Litteraturhistoria föreläsning', 'En resa genom litteraturens historia.', 1, 97, 6, 220, '2026-03-20', '18:00:00', '20:00:00'),

      ('Grundläggande musikteori', 'Lär dig grunderna i musikteori.', 2, 141, 3, 250, '2026-04-01', '17:00:00', '19:00:00'),
      ('Jazzimprovisation', 'Improvisera med jazzskalan.', 2, 7, 5, 300, '2026-04-05', '18:00:00', '20:00:00'),
      ('Sångteknik workshop', 'Utveckla din sångröst.', 2, 8, 4, 350, '2026-04-10', '16:00:00', '18:00:00'),
      ('Kompositionskurs', 'Lär dig komponera musik.', 2, 9, 6, 400, '2026-04-15', '17:30:00', '19:30:00'),
      ('Musikanalys seminarie', 'Analysera olika musikstycken.', 2, 10, 7, 280, '2026-04-20', '18:00:00', '20:00:00'),

      ('Vandring i skogen', 'Utforska skogen och lär dig om naturen.', 3, 11, 5, 100, '2026-05-01', '09:00:00', '12:00:00'),
      ('Fågelskådning för nybörjare', 'Lär dig känna igen fåglar.', 3, 12, 3, 150, '2026-05-05', '07:00:00', '10:00:00'),
      ('Bushcraft-kurs', 'Grundläggande överlevnadstekniker.', 3, 13, 6, 350, '2026-05-10', '10:00:00', '15:00:00'),
      ('Botanikworkshop', 'Lär dig om växter och blommor.', 3, 14, 4, 200, '2026-05-15', '13:00:00', '16:00:00'),
      ('Naturfotografering', 'Fotografera naturen på bästa sätt.', 3, 15, 7, 250, '2026-05-20', '14:00:00', '18:00:00'),

      ('Introduktion till programmering', 'Lär dig grunderna i programmering.', 4, 16, 8, 300, '2026-06-01', '17:00:00', '20:00:00'),
      ('Datasäkerhet för alla', 'Så skyddar du din data online.', 4, 17, 5, 220, '2026-06-05', '18:00:00', '20:00:00'),
      ('Maskininlärning 101', 'Grunderna i AI och ML.', 4, 18, 4, 400, '2026-06-10', '16:00:00', '19:00:00'),
      ('Webbutveckling med React', 'Bygg webbappar med React.', 4, 19, 6, 350, '2026-06-15', '17:30:00', '20:30:00'),
      ('Databashantering', 'Lär dig SQL och databaser.', 4, 10, 7, 280, '2026-06-20', '18:00:00', '20:00:00'),

      ('Spansk konversationskväll', 'Öva spanska i avslappnad miljö.', 5, 20, 8, 150, '2026-07-01', '18:00:00', '20:00:00'),
      ('Fransk grammatik workshop', 'Förbättra din franska grammatik.', 5, 21, 4, 200, '2026-07-05', '17:00:00', '19:00:00'),
      ('Uttalsträning engelska', 'Träna på rätt uttal.', 5, 22, 3, 100, '2026-07-10', '16:00:00', '18:00:00'),
      ('Konversation på tyska', 'Öva att prata tyska.', 5, 23, 6, 180, '2026-07-15', '17:30:00', '19:30:00'),
      ('Svenska för nybörjare', 'Lär dig svenska från grunden.', 5, 24, 5, 220, '2026-07-20', '18:00:00', '20:00:00'),

      ('Fotografi workshop', 'Lär dig grunderna i fotografering.', 6, 25, 7, 250, '2026-08-01', '17:00:00', '19:00:00'),
      ('Skulpturkurs', 'Skapa konst i lera.', 6, 26, 3, 300, '2026-08-05', '18:00:00', '20:00:00'),
      ('Teaterimprovisation', 'Lär dig improvisera på scen.', 6, 27, 4, 350, '2026-08-10', '16:00:00', '18:00:00'),
      ('Danskurs', 'Lär dig olika dansstilar.', 6, 28, 6, 400, '2026-08-15', '17:30:00', '19:30:00'),
      ('Konsthistoria föreläsning', 'Upptäck konsthistoriens värld.', 6, 29, 7, 280, '2026-08-20', '18:00:00', '20:00:00'),

      ('Löpning för nybörjare', 'Kom igång med löpning.', 7, 76, 5, 100, '2026-09-01', '07:00:00', '08:00:00'),
      ('Yoga och mindfulness', 'Träna kropp och själ.', 7, 32, 3, 150, '2026-09-05', '18:00:00', '19:00:00'),
      ('Styrketräning grundkurs', 'Bygg styrka på rätt sätt.', 7, 22, 6, 350, '2026-09-10', '17:00:00', '19:00:00'),
      ('Cyklingstur', 'Upptäck naturen på cykel.', 7, 80, 4, 200, '2026-09-15', '09:00:00', '12:00:00'),
      ('Simning för alla', 'Simteknik och vattenvana.', 7, 12, 7, 250, '2026-09-20', '16:00:00', '18:00:00'),

      ('Memoarworkshop', 'Börja skriva din egen livsberättelse.', 1, 36, 4, 240, '2026-03-28', '17:00:00', '19:00:00'),
      ('Dialog och karaktärer', 'Skapa trovärdiga karaktärer i din text.', 1, 37, 2, 150, '2026-04-20', '18:00:00', '20:00:00'),
      ('Boktips och bokbyte', 'Ta med en bok och byt med någon annan.', 1, 38, 6, 100, '2026-03-25', '16:00:00', '17:30:00'),
      ('Shakespeares kvinnor', 'Porträttering av kvinnor i William Shakespeares verk.', 1, 108, 2, 200, '2026-03-21', '18:00:00', '20:00:00'),
      ('Skriv en deckare', 'Lär dig knepen bakom spännande mysterier.', 1, 158, 6, 220, '2026-04-20', '19:00:00', '21:30:00'),

      ('Klassiska album', 'Upptäck och diskutera ikoniska skivor.', 2, 117, 3, 180, '2026-04-14', '18:30:00', '20:00:00'),
      ('Elektronisk musik', 'Skapa beats och melodier digitalt.', 2, 47, 1, 300, '2026-03-24', '18:00:00', '19:45:00'),
      ('Det svenska musikundret', 'Hur blev Sverige så stora inom musikvärlden?', 2, 48, 3, 240, '2026-05-20', '16:00:00', '18:00:00'),
      ('Från Mozart till Zimmer', 'Hur klassisk musik gick från orkesterföreställning till bioduken.', 2, 49, 2, 350, '2026-05-12', '19:00:00', '21:00:00'),
      ('Skriv din första låt', 'Upptäck hur det är att komponera egen musik.', 2, 50, 4, 300, '2026-04-25', '18:00:00', '20:30:00'),

      ('Fjärilsspaning', 'Lär dig känna igen vanliga fjärilar.', 3, 175, 2, 200, '2026-03-27', '16:00:00', '18:00:00'),
      ('Stjärnskådning', 'Lär dig hitta stjärnbilder på natthimlen.', 3, 52, 6, 300, '2026-03-14', '20:00:00', '22:00:00'),
      ('Klimatförändringar', 'Hur påverkar de vår närmiljö och vardag?', 3, 53, 4, 240, '2026-04-17', '18:00:00', '20:00:00'),
      ('Skogens ekosystem', 'Hur samspelar växter, djur och svampar i våra skogar?', 3, 54, 2, 220, '2026-05-03', '17:00:00', '19:00:00'),
      ('Pollinatörernas betydelse', 'Hur bin och fjärilar påverkar vår matförsörjning.', 3, 140, 8, 275, '2026-03-17', '18:00:00', '20:00:00'),

      ('Python för problemlösning', 'Lär dig lösa vardagsproblem med kod.', 4, 56, 8, 250, '2026-03-10', '18:00:00', '20:00:00'),
      ('E-handel i praktiken', 'Bygg en enkel webbutik från grunden.', 4, 57, 3, 350, '2026-04-15', '19:00:00', '21:00:00'),
      ('Skapa ditt eget dataspel', 'Introduktion till spelutveckling.', 4, 111, 8, 300, '2026-03-29', '16:00:00', '18:30:00'),
      ('Kryptering och integritet', 'Hur skyddas vår data på nätet?', 4, 59, 8, 250, '2026-03-14', '19:00:00', '20:30:00'),
      ('Internet of Things', 'Hur påverkar uppkopplade prylar våra hem och samhällen?', 4, 60, 6, 175, '2026-03-27', '17:30:00', '19:30:00'),

      ('Italienskt språkcafé', 'Prata italienska över en middag.', 5, 61, 6, 200, '2026-04-05', '18:00:00', '20:00:00'),
      ('Arabiska för nybörjare', 'Lär dig alfabetet och enkla fraser.', 5, 62, 3, 240, '2026-05-02', '16:30:00', '18:00:00'),
      ('Språkutbyte', 'Hitta en språkkompis och lär av varandra.', 5, 62, 8, 150, '2026-04-22', '19:00:00', '21:00:00'),
      ('Japanska genom kultur', 'Lär dig språket via mat, film och traditioner.', 5, 76, 6, 220, '2026-03-20', '18:00:00', '20:00:00'),
      ('Språkutveckling hos barn', 'Hur lär sig barn flera språk samtidigt?', 5, 65, 3, 220, '2026-04-12', '17:00:00', '19:00:00'),

      ('Serieteckning', 'Rita och berätta med bilder.', 6, 66, 4, 170, '2026-04-13', '16:00:00', '19:00:00'),
      ('Improvisationsteater', 'Lekfulla övningar för nybörjare.', 6, 67, 3, 250, '2026-05-12', '18:00:00', '20:00:00'),
      ('Renässansens påverkan på dagens konst', 'Från Da Vinci till modern design.', 6, 146, 8, 300, '2026-04-20', '19:00:00', '22:00:00'),
      ('Filmens berättarteknik', 'Hur används klippning och musik för att skapa känslor?', 6, 69, 4, 280, '2026-04-01', '17:00:00', '19:30:00'),
      ('Arkitekturens historia', 'Hur har våra bostäder förändrats genom tiderna?', 6, 70, 3, 220, '2026-05-10', '18:00:00', '20:00:00'),

      ('Avslappning med andning', 'Lär dig tekniker för stresshantering.', 7, 71, 6, 175, '2026-04-25', '17:00:00', '19:00:00'),
      ('Sömnens betydelse för återhämtning', 'Hur påverkar sömn vår fysiska och mentala prestation?', 7, 72, 8, 200, '2026-03-16', '18:00:00', '20:00:00'),
      ('Mental träning och stresshantering', 'Vilka tekniker kan förbättra vårt välmående i vardagen?', 7, 73, 1, 150, '2026-06-12', '16:00:00', '18:00:00'),
      ('Fysisk aktivitet genom livet', 'Hur förändras kroppens behov av träning i olika åldrar?', 7, 152, 3, 125, '2026-05-27', '16:00:00', '17:30:00'),
      ('Kost och näringslära', 'Vad säger forskningen om balansen mellan kolhydrater, fett och protein?', 7, 75, 4, 250, '2026-04-06', '19:00:00', '21:00:00'),

      ('Fantasyvärldar och worldbuilding', 'Skapa trovärdiga världar till dina berättelser.', 1, 214, 5, 260, '2026-04-08', '17:00:00', '19:30:00'),
      ('Skriv poesi med känsla', 'Utforska bildspråk och metaforer.', 1, 487, 3, 180, '2026-04-18', '18:00:00', '20:00:00'),
      ('Att skriva för barn', 'Lär dig anpassa språk och berättelse för yngre läsare.', 1, 903, 4, 220, '2026-05-02', '16:00:00', '18:00:00'),
      ('Publicering och förlagskontakt', 'Så når du ut med ditt manus.', 1, 156, 6, 300, '2026-05-18', '18:30:00', '20:30:00'),

      ('Musikproduktion i hemmastudio', 'Diskutera inspelning, mixning och kreativa processer.', 2, 742, 7, 380, '2026-06-12', '17:30:00', '20:30:00'),
      ('Filmmusikens kraft', 'Hur musik förstärker berättelser på film.', 2, 319, 5, 240, '2026-06-25', '19:00:00', '21:00:00'),

      ('Naturens berättelser', 'Samtal om naturupplevelser och hur de påverkar kreativitet.', 3, 865, 6, 280, '2026-07-04', '18:00:00', '20:00:00'),
      ('Hållbar livsstil i vardagen', 'Diskussion om små förändringar med stor påverkan.', 3, 278, 4, 220, '2026-07-19', '17:00:00', '19:00:00'),
      ('Reseskildringar och äventyr', 'Dela och analysera minnesvärda resor.', 3, 990, 3, 180, '2026-07-27', '18:00:00', '20:00:00'),

      ('TypeScript från grunden', 'Statisk typning i praktiken.', 4, 604, 8, 350, '2026-08-03', '17:00:00', '20:00:00'),
      ('Bygg API med Node.js', 'Arkitektur och best practices för REST-API.', 4, 811, 6, 400, '2026-08-09', '18:00:00', '21:00:00'),
      ('UX-design workshop', 'Diskutera användarvänliga gränssnitt och designval.', 4, 432, 5, 300, '2026-08-16', '17:30:00', '20:00:00'),
      ('Testning med Jest', 'Strategier för robust och testbar kod.', 4, 725, 4, 250, '2026-08-22', '18:00:00', '20:00:00'),

      ('Portugisisk konversation', 'Träna portugisiska i grupp över middag.', 5, 158, 6, 200, '2026-09-03', '18:00:00', '20:00:00'),
      ('Koreanska för nybörjare', 'Lär dig hangul och enkla fraser.', 5, 540, 5, 250, '2026-09-10', '17:00:00', '19:00:00'),
      ('Affärsengelska', 'Kommunicera professionellt på engelska.', 5, 872, 4, 300, '2026-09-18', '18:00:00', '20:00:00'),
      ('Retorik och presentationsteknik', 'Tala tydligt och övertygande.', 5, 366, 7, 220, '2026-09-25', '17:30:00', '19:30:00'),

      ('Akvarellmålningens uttryck', 'Samtal om teknik, färg och konstnärliga val.', 6, 941, 6, 280, '2026-10-02', '17:00:00', '19:30:00'),
      ('Street art och samhällspåverkan', 'Diskutera gatukultur och konst i offentlig miljö.', 6, 257, 5, 300, '2026-10-09', '16:00:00', '19:00:00'),

      
      ('Mindset och personlig utveckling', 'Reflekterande samtal om mål och motivation.', 7, 777, 5, 190, '2026-11-08', '18:00:00', '19:30:00'),
      
      ('Manusskrivande för film', 'Bygg dramaturgi och karaktärer.', 1, 689, 4, 350, '2026-10-16', '18:00:00', '21:00:00'),
      ('Dystopier och samhällskritik', 'Hur speglar dystopisk litteratur vår samtid?', 1, 742, 6, 230, '2026-11-15', '18:00:00', '20:00:00'),
      ('True crime och berättarteknik', 'Varför fascineras vi av verkliga brott?', 1, 915, 5, 260, '2026-11-22', '18:30:00', '20:30:00'),
      ('Autofiktionens framväxt', 'När går gränsen mellan verklighet och fiktion?', 1, 388, 4, 240, '2026-11-29', '17:30:00', '19:30:00'),

      ('Musik och nostalgi', 'Varför kopplar vi minnen så starkt till musik?', 2, 804, 7, 210, '2026-12-02', '19:00:00', '21:00:00'),
      ('Streamingens påverkan på artister', 'Hur har Spotify förändrat musikbranschen?', 2, 967, 6, 250, '2026-12-09', '18:00:00', '20:00:00'),
      ('Låttexter som poesi', 'Analysera moderna låttexter tillsammans.', 2, 523, 5, 220, '2026-12-16', '18:00:00', '20:00:00'),

      ('Hållbar livsstil i vardagen', 'Små förändringar med stor påverkan.', 3, 876, 8, 180, '2027-01-10', '18:00:00', '20:00:00'),
      ('Naturens roll i stadsmiljö', 'Hur skapar vi grönare städer?', 3, 654, 6, 200, '2027-01-17', '18:00:00', '20:00:00'),
      ('Dokumentärer om klimatet', 'Diskussion kring aktuella miljöfilmer.', 3, 650, 5, 190, '2027-01-24', '18:30:00', '20:30:00'),

      ('AI i vardagen', 'Hur påverkar artificiell intelligens våra liv?', 4, 990, 9, 320, '2027-02-03', '18:00:00', '20:30:00'),
      ('Tech-etik och integritet', 'Balansen mellan innovation och privatliv.', 4, 711, 6, 280, '2027-02-10', '18:00:00', '20:00:00'),
      ('Framtidens arbetsmarknad', 'Vilka jobb påverkas mest av automatisering?', 4, 845, 7, 260, '2027-02-17', '18:00:00', '20:00:00'),

      ('Språk och identitet', 'Hur formar språket vår självbild?', 5, 934, 6, 210, '2027-03-02', '18:00:00', '20:00:00'),
      ('Dialekter och status', 'Varför värderas vissa dialekter högre?', 5, 564, 5, 180, '2027-03-09', '18:00:00', '20:00:00'),
      ('Översättningens konst', 'Vad går förlorat mellan språk?', 5, 808, 4, 240, '2027-03-16', '18:00:00', '20:00:00'),

      ('Kulturdebatt: Kan konst vara objektiv?', 'Diskussion om konst, politik och yttrandefrihet.', 6, 999, 8, 300, '2027-04-06', '18:00:00', '20:30:00'),
      ('Filmklassiker genom tiderna', 'Vilka filmer har format vår kultur?', 6, 784, 7, 230, '2027-04-13', '18:00:00', '20:00:00'),
      ('Sociala medier och kreativitet', 'Har Instagram förändrat konsten?', 6, 458, 6, 220, '2027-04-20', '18:00:00', '20:00:00'),

      ('Mental styrka i vardagen', 'Strategier för att hantera motgångar.', 7, 720, 6, 190, '2027-05-04', '18:00:00', '20:00:00'),
      ('Vanor och motivation', 'Hur skapar vi hållbara rutiner?', 7, 882, 7, 210, '2027-05-11', '18:00:00', '20:00:00'),
      ('Balans mellan arbete och fritid', 'Hur hittar vi en hållbar livsstil?', 7, 366, 5, 200, '2027-05-18', '18:00:00', '20:00:00');

      
  `);

    const [restaurants]: any = await connection.query(
      `SELECT id FROM tripadvisor_restaurants
       WHERE city IN ('Stockholm', 'Göteborg', 'Malmö')
       ORDER BY city ASC, id ASC`
    );

    if (!restaurants?.length) {
      console.log('Skipping events (no restaurants in selected cities).');
      return;
    }

    const [templates]: any = await connection.query(
      `SELECT title, description, category_id, current_participants, price, date, start_time, end_time
       FROM event_templates
       ORDER BY id ASC`
    );

    if (!templates?.length) {
      console.log('Skipping events (no templates found).');
      return;
    }

    const values: any[] = [];
    const placeholders = templates.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    for (let i = 0; i < templates.length; i += 1) {
      const template = templates[i];
      const restaurantId = restaurants[i % restaurants.length].id;
      values.push(
        template.title,
        template.description,
        template.category_id,
        restaurantId,
        template.current_participants,
        template.price,
        template.date,
        template.start_time,
        template.end_time
      );
    }

    await connection.query(
      `INSERT INTO events
        (title, description, category_id, restaurant_id, current_participants, price, date, start_time, end_time)
       VALUES ${placeholders}`,
      values
    );

    await connection.query(`
    INSERT INTO event_tags (event_id, tag_id) VALUES
      (1, 1), (1, 2), (1, 4), (1, 7),      
      (2, 2), (2, 4),
      (3, 1), (3, 4),
      (4, 1), (4, 4),
      (5, 5), (5, 9),

      (6, 11), (6, 13), (6, 16),
      (7, 11), (7, 19),
      (8, 15), (8, 16),
      (9, 13), (9, 14), (9, 16),
      (10, 13), (10, 16), (10, 17),

      (11, 24),
      (12, 23), (12, 27),
      (13, 26),
      (14, 28), (14, 29),
      (15, 23),

      (16, 31),
      (17, 33), (17, 39),
      (18, 34), (18, 38),
      (19, 32), (19, 36), (19, 37),
      (20, 31), (20, 39),

      (21, 43), (21, 47),
      (22, 41), (22, 47),
      (23, 42), (23, 43), (23, 47),
      (24, 43), (24, 47),
      (25, 43), (25, 47),

      (26, 53),
      (27, 52),
      (28, 54),
      (29, 55),
      (30, 51), (30, 57),
      
      (31, 61),
      (32, 63), (32, 69),
      (33, 65),
      (34, 69),
      (35, 66),

      (36, 3), (36, 4),
      (37, 1), (37, 4), (37, 7),
      (38, 8),
      (39, 5), (39, 6), (39, 9),
      (40, 1), (40, 4), (40, 7),

      (41, 17), (41, 18), (41, 20),
      (42, 13), (42, 14), (42, 20),
      (43, 17), (43, 20),
      (44, 13), (44, 16), (44, 17),
      (45, 13), (45, 14), (45, 16), (45, 18), (45, 20),

      (46, 22), (46, 23),
      (47, 23),
      (48, 22), (48, 25), (48, 30),
      (49, 22), (49, 25), (49, 30),
      (50, 22),

      (51, 31),
      (52, 31), (52, 32), (52, 36), (52, 37),
      (53, 31),
      (54, 33), (54, 40),
      (55, 32), (55, 34), (55, 39),

      (56, 43), (56, 44), (56, 48),
      (57, 43), (57, 44), (57, 48),
      (58, 43), (58, 48),
      (59, 45),
      (60, 44), (60, 48),

      (61, 58), (61, 60),
      (62, 54),
      (63, 51), (63, 57), (63, 60),
      (64, 53), (64, 57), (64, 60),
      (65, 51), (65, 56),
      
      (66, 64), (66, 70),
      (67, 70),
      (68, 64), (68, 70),
      (69, 62), (69, 65), (69, 68),
      (70, 68),
      
      (71, 1), (71, 7),
      (72, 2),
      (73, 1), (73, 4), (73, 7),
      (74, 7),
      (75, 14),
      (76, 16), (76, 17),

      (77, 22), (77, 24),
      (78, 22),
      (79, 23),
      (80, 31), (80, 32),
      (81, 31), (81, 40),
      (82, 36),
      (83, 31), (83, 35),

      (84, 43), (84, 48),
      (85, 41), (85, 42), (85, 43), (85, 48),
      (86, 43),

      (88, 57), (88, 58),
      (89, 51), (89, 56), (89, 59), (89, 60),

      (90, 64), (90, 70),

      (91, 1), (91, 4),
      (92, 5), (92, 6),
      (93, 4),
      (94, 4), (94, 5), (94, 6),

      (95, 16), (95, 17),
      (96, 16), (96, 20),
      (97, 14), (97, 16), (97, 17),

      (98, 22),
      (99, 22), (99, 25),
      (100, 22), (100, 25),

      (101, 39),
      (102, 33),
      (103, 34), (103, 38), (103, 39),

      (104, 45), (104, 48), (104, 50),
      (105, 47), (105, 50),
      (106, 45), (106, 46),

      (107, 57), (107, 59), (107, 60),
      (108, 53), (108, 57),
      (109, 58),

      (110, 64),
      (111, 64), (111, 65), (111, 70),
      (112, 64), (112, 70)
      ;
      `);
      } finally {
        connection.release();
      }
}

// Kör funktionen för att fylla databasen med eventdata
// seedEvents()
//   .then(() => {
//     console.log('SEED EVENTS DONE');
//     process.exit();
//   })
//   .catch(console.error);
