import { Container, Title, Text } from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';

export default function ContactPage(): React.ReactNode {
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Kontakt{' '}
        </Title>
        <Text>
          Har du frågor, feedback eller behöver hjälp? Tveka inte att kontakta
          oss! Vi finns här för att hjälpa dig och göra din upplevelse på
          DinnerWise så smidig som möjligt. Du kan nå oss via e-post på
          <Text span c='red'>
            {' '}
            {APP_CONFIG.contactEmail}{' '}
          </Text>
          eller ringa oss på{' '}
          <Text span c='red'>
            {APP_CONFIG.telephone}
          </Text>
          . Vi ser fram emot att höra från dig!
        </Text>
      </Container>
    </>
  );
}
