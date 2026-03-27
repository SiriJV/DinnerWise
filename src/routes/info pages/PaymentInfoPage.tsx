import { Container, Title, Text, Stack, Box } from '@mantine/core';
import DemoWarningText from '../../components/DemoWarningText/DemoWarningText';

export default function PaymentInfoPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Betalning
        </Title>
        <Stack gap='md'>
          <DemoWarningText text='Faktiska betalningar är inte aktiverade.' />

          <Box>
            <Title order={3} mb='xs'>
              Betalningsmetoder
            </Title>
            <Text>
              Vi accepterar flera olika betalningsmetoder för att göra det
              enkelt för dig:
            </Text>
            <ul>
              <li>
                <Text span fw={600}>
                  Swish
                </Text>{' '}
                - Direkt betalning via mobilt BankID
              </li>
              <li>
                <Text span fw={600}>
                  Kreditkort
                </Text>{' '}
                - Visa & Mastercard
              </li>
              <li>
                <Text span fw={600}>
                  Klarna
                </Text>{' '}
                - Köp nu, betala sen
              </li>
            </ul>
          </Box>

          <Box>
            <Title order={3} mb='xs'>
              Prissättning
            </Title>
            <Text>
              Priset för varje event varierar beroende på värd och restaurang.
              Du kommer att se det exakta priset innan du slutför din bokning
              och kan välja den betalningsmetod som passar dig bäst.
            </Text>
          </Box>

          <Box>
            <Title order={3} mb='xs'>
              Säkerhet
            </Title>
            <Text>
              Din betalningsinformation är alltid säker hos oss. Vi använder
              kryptering och följer högsta säkerhetsstandarder för att skydda
              dina personliga uppgifter.
            </Text>
          </Box>

          <Box>
            <Title order={3} mb='xs'>
              Bekräftelse
            </Title>
            <Text>
              När din betalning är genomförd kommer du att få en bekräftelse via
              e-post med alla detaljer om ditt event. Du kan också se din
              bokning i din profil.
            </Text>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
