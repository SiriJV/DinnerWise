import { Container, Title, Text, Stack } from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';
import { Link } from 'react-router-dom';

export default function ContactPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Kontakt{' '}
        </Title>
        <Stack>
          <Text>
            Har du frågor, feedback eller behöver hjälp? Tveka inte att kontakta
            oss! Vi finns här för att hjälpa dig och göra din upplevelse på{' '}
            {APP_CONFIG.brandName} så smidig som möjligt.{' '}
          </Text>
          <Text>
            Läs gärna vår{' '}
            <Link to='/faq' style={{ textDecoration: 'none' }}>
              <Text span c='red' unstyled>
                FAQ
              </Text>
            </Link>{' '}
            först för att se om du kan få svar på dina frågor där.
          </Text>
          <Text>
            Annars når du oss via e-post på
            <Text span c='red'>
              {' '}
              {APP_CONFIG.contactEmail} (demo){' '}
            </Text>
            eller via telefon på{' '}
            <Text span c='red'>
              {APP_CONFIG.telephone} (demo)
            </Text>
            . Vi ser fram emot att höra från dig!
          </Text>
        </Stack>
      </Container>
    </>
  );
}
