import { Container, Title, Text, Stack } from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';
import DemoWarningText from '../../components/common/DemoWarningText/DemoWarningText';

export default function TermsPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Köpvillkor{' '}
        </Title>
        <Stack>
          <DemoWarningText text='Köpvillkoren är endast exempel.' />

          <Text>
            Genom att boka ett event på {APP_CONFIG.brandName} godkänner du
            dessa villkor. Du ansvarar för att alla uppgifter du anger är
            korrekta och att du är en giltig bokare.
          </Text>
          <Text>
            <Text span fw={800}>
              Ångra och återbetalning:
            </Text>{' '}
            Du kan avboka din bokning upp till 7 dagar före eventet och få full
            återbetalning. Avbokningar gjorda mindre än 7 dagar före eventet
            förloras.
          </Text>
          <Text>
            <Text span fw={800}>
              Bindande bokning:
            </Text>{' '}
            Alla bokningar är bindande. Vid utebliven närvaro eller sen
            avbokning (mindre än 7 dagar före eventet) debiteras hela beloppet.
          </Text>
          <Text>
            <Text span fw={800}>
              Betalningsvillkor:
            </Text>{' '}
            Betalning sker i samband med bokning via de betalningsmetoder som
            erbjuds på plattformen. Bokningen är giltig först när betalningen är
            genomförd och bekräftad.
          </Text>
          <Text>
            <Text span fw={800}>
              Inställda event:
            </Text>{' '}
            Om ett event ställs in av arrangören eller restaurangen återbetalas
            hela beloppet automatiskt till det konto som användes vid betalning.
          </Text>
          <Text>
            <Text span fw={800}>
              Force majeure:
            </Text>{' '}
            {APP_CONFIG.brandName} ansvarar inte för förseningar eller inställda
            event som beror på omständigheter utanför vår kontroll, såsom
            strejk, naturkatastrofer eller myndighetsbeslut.
          </Text>
          <Text>
            <Text span fw={800}>
              Kontakt:
            </Text>{' '}
            Vid frågor om bokning, betalning eller villkor kontakta oss på{' '}
            <Text span fw={800}>
              {APP_CONFIG.contactEmail}
            </Text>
            .
          </Text>
        </Stack>
      </Container>
    </>
  );
}
