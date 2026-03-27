import { Container, Title, Text, Stack } from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';
import DemoWarningText from '../../components/DemoWarningText/DemoWarningText';

export default function PrivacyPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Integritetspolicy{' '}
        </Title>
        <Stack>
          <DemoWarningText text='Integritetspolicyn är endast ett exempel.' />
          <Text>
            Vi respekterar din integritet och skyddar dina personliga uppgifter.
            Din information används endast för att förbättra din upplevelse på{' '}
            {APP_CONFIG.brandName}. Vi lagrar namn, e-postadress, telefonnummer
            och bokningshistorik för att kunna ge dig en sömlös
            bokningsupplevelse.
          </Text>
          <Text>
            Vi delar aldrig dina personliga uppgifter med tredje part utan ditt
            samtycke, förutom med värdar för att de ska kunna slutföra och
            genomföra eventet du har bokat. Din data är krypterad och säker hos
            oss.
          </Text>
        </Stack>
      </Container>
    </>
  );
}
