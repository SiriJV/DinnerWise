import { Container, Title, Text, Stack } from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';

export default function CookiesPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Cookies{' '}
        </Title>
        <Stack>
          <Text>
            {APP_CONFIG.brandName} använder cookies för att förbättra din
            upplevelse på vår webbplats. Cookies hjälper oss att komma ihåg dina
            inställningar, analysera hur sidan används och göra det enklare för
            dig att logga in och navigera mellan olika sidor.
          </Text>
          <Text>
            Vi använder både nödvändiga cookies (för att sidan ska fungera) och
            analytiska cookies (för att förstå och förbättra tjänsten). Du kan
            själv välja att blockera cookies i din webbläsare, men vissa
            funktioner kan då sluta fungera som tänkt.
          </Text>
          <Text>
            Genom att fortsätta använda {APP_CONFIG.brandName} godkänner du vår
            användning av cookies. Vill du veta mer om hur vi hanterar din data?
            Kontakta oss gärna!
          </Text>
        </Stack>
      </Container>
    </>
  );
}
