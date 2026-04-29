import { Text, Button, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../../config/appConfig';

export type FAQItem = {
  title: string;
  content: React.ReactNode;
  category: string;
};

export const getFAQdata = (
  openCreate: () => void,
  isLoggedIn: boolean,
): FAQItem[] => [
  // Allmänt
  {
    category: 'Allmänt',
    title: `Vad är ${APP_CONFIG.brandName}?`,
    content: (
      <>
        <Text>
          {APP_CONFIG.brandName} är en plattform där du kan upptäcka och delta i
          middagsevent som skapas av andra användare, kallade värdar. Du kan
          bläddra bland olika event baserat på plats, ämne eller datum, och
          anmäla dig till de som lockar dig. Läs mer om oss{' '}
          <Anchor component={Link} to={'/om-oss'}>
            här
          </Anchor>
          .
        </Text>
      </>
    ),
  },
  {
    category: 'Allmänt',
    title: `Är det gratis att använda ${APP_CONFIG.brandName}?`,
    content: `Ja, det är gratis att använda vår plattform för att skapa ett konto och bläddra bland event. För att delta i event behöver du dock betala en kostnad för att täcka mat och dryck, vilket specificeras av värden när eventet skapas.`,
  },
  {
    category: 'Allmänt',
    title: 'Finns det åldersgräns?',
    content:
      'Ja, det finns åldersgräns. Av säkerhetsskäl måste du vara minst 18 år för att skapa ett konto och delta i event.',
  },
  // Konto
  ...(!isLoggedIn
    ? [
        {
          category: 'Konto',
          title: 'Hur skapar jag ett konto?',
          content: (
            <>
              <Text>
                Du kan skapa ett konto genom att klicka på knappen nedan, i
                menyn till vänster alternativt i det övre högra hörnet på
                hemsidan. Fyll i dina uppgifter och följ instruktionerna för att
                slutföra registreringen.
              </Text>
              <Button variant='outline' mt='sm' onClick={openCreate}>
                Skapa konto
              </Button>
            </>
          ),
        },
      ]
    : []),
  {
    category: 'Konto',
    title: 'Hur ändrar jag mina uppgifter?',
    content:
      'Du kan ändra dina uppgifter genom att gå till din profilsida och klicka på "Redigera profil". Där kan du uppdatera namn, e-post, telefonnummer och profilbild.',
  },
  {
    category: 'Konto',
    title: 'Hur tar jag bort mitt konto?',
    content:
      'Om du vill ta bort ditt konto kan du kontakta oss via e-post. Observera att all din data, inklusive eventhistorik och omdömen, kommer att raderas permanent.',
  },
  // Delta i event
  {
    category: 'Delta i event',
    title: 'Hur anmäler jag mig till ett event?',
    content: `För att anmäla dig till ett event går du in på eventet och klickar på knappen längst ner på sidan där det står "Anmäl dig här". Om eventet redan är fullbokat kan du ställa dig på väntelista och blir kontaktad om en plats blir ledig.`,
  },
  {
    category: 'Delta i event',
    title: 'Kan jag ta med en vän?',
    content:
      'Absolut! När du anmäler dig kan du välja att boka flera platser om det finns lediga. Tänk på att varje person behöver skriva in sina kontaktuppgifter och betala avgift.',
  },
  {
    category: 'Delta i event',
    title: 'Kan jag avboka min anmälan?',
    content:
      'Ja, du kan avboka din anmälan upp till 7 dagar innan eventet startar och få full återbetalning. Vid avbokning mindre än 7 dagar innan eventet fryser pengarna inne.',
  },
  {
    category: 'Delta i event',
    title: 'Hur hanteras matallergier och specialkost?',
    content:
      'När du anmäler dig till ett event kan du ange eventuella allergier eller kostpreferenser. Värden får denna information och kan anpassa menyn därefter. Vi rekommenderar att du alltid kontaktar värden direkt om du har allvarliga allergier.',
  },
  // Betalning
  {
    category: 'Betalning',
    title: 'Hur betalar jag för att gå med i event?',
    content: `Du betalar genom Swish, Klarna eller kreditkort när du anmäler dig till eventet. Betalningen sker i samband med att du anmäler dig, och du får en bekräftelse via e-post.`,
  },
  {
    category: 'Betalning',
    title: 'Vad händer om värden ställer in eventet?',
    content:
      'Om värden ställer in eventet får du automatiskt full återbetalning inom 3-5 arbetsdagar. Du får också ett meddelande via e-post så snart eventet ställs in.',
  },
  // Skapa event
  {
    category: 'Skapa event',
    title: 'Hur skapar jag ett event?',
    content: `Du klickar på en av knapparna med ett plus (+) på eller trycker på "Skapa event" i menyn till vänster när du är inloggad. Fyll i relevant information, välj datum, tid och plats och bekräfta. När eventet är godkänt av oss publiceras det på hemsidan.`,
  },
  {
    category: 'Skapa event',
    title: 'Vad kostar det att vara värd?',
    content: `Det är gratis att skapa event på ${APP_CONFIG.brandName}. Vi tar en liten serviceavgift på betalningarna för att täcka transaktionskostnader och plattformsunderhåll. Resterande del av anmälningsavgiften går till att betala för din mat och dryck på eventet.`,
  },
  {
    category: 'Skapa event',
    title: 'Hur sätter jag pris på mitt event?',
    content:
      'Du bestämmer själv priset för ditt event. Vi rekommenderar att du täcker dina kostnader för mat och eventuella andra utgifter.',
  },
  // Säkerhet
  {
    category: 'Säkerhet',
    title: 'Är det säkert att gå på event?',
    content: (
      <>
        <Text>
          Vi tar din säkerhet på allvar. Alla användare verifieras via e-post
          och telefonnummer. Efter varje event kan deltagare lämna omdömen, både
          på värd och eventet i sig. Upptäcker du något som inte stämmer eller
          känner dig osäker så kan du alltid{' '}
          <Anchor component={Link} to={'/kontakt'}>
            kontakta oss
          </Anchor>{' '}
          eller gå direkt till en profil eller ett event för att rapportera
          problemet.
        </Text>
      </>
    ),
  },
  {
    category: 'Säkerhet',
    title: 'Hur kontaktar jag värden?',
    content:
      'När du har anmält dig till ett event får du tillgång till kontaktuppgifter till värden. Kontakta dem om du har frågor eller behöver avanmäla dig pga sjukdom eller liknande.',
  },
  {
    category: 'Säkerhet',
    title: 'Hur lämnar jag ett omdöme?',
    content:
      'Efter att eventet har ägt rum får du ett e-postmeddelande med en länk för att lämna omdöme. Omdömen hjälper andra användare att hitta bra event och pålitliga värdar.',
  },
];
