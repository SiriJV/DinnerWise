import {
  Container,
  Text,
  SimpleGrid,
  Stack,
  TextInput,
  Button,
  Center,
} from '@mantine/core';
import { useState } from 'react';

export default function NewsLetterCTA(): React.ReactNode {
  const [name, setName] = useState('');
  const [emailTo, setEmailTo] = useState('');

  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmail = async () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('Fyll i ditt namn');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!emailTo || !isValidEmail(emailTo)) {
      setEmailError('Ogiltig e-postadress');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (hasError) return;

    const firstName = name.trim().split(' ')[0];

    try {
      const response = await fetch(
        'http://localhost:3001/email/send-newsletter-confirmation-email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: emailTo,
            name: firstName,
          }),
        },
      );

      const data = await response.json();
      console.log('Mail skickat:', data);

      setEmailTo('');
      setName('');
    } catch (err) {
      console.error('Fetch failed', err);
    }
  };
  return (
    <>
      <Center bg='lightred.5' pt='xl'>
        <Container size='lg'>
          {/* Newsletter */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg' pb='xl'>
            <Stack>
              <Text fw={600}>Håll dig uppdaterad!</Text>
              <Text size='sm'>
                Skriv upp dig på vårt nyhetsbrev för att få de senaste
                uppdateringarna, tipsen och exklusiva erbjudanden direkt i din
                inkorg
              </Text>
            </Stack>

            <SimpleGrid
              cols={{ base: 1, xs: 2 }}
              spacing='xs'
              style={{ alignItems: 'flex-end' }}>
              <TextInput
                label='Namn'
                placeholder='Anna Svensson'
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />

              <TextInput
                label='E-post'
                placeholder='exempel@epost.se'
                value={emailTo}
                onChange={(e) => setEmailTo(e.currentTarget.value)}
              />

              <Button
                onClick={handleSendEmail}
                disabled={!name || !emailTo || !isValidEmail(emailTo)}>
                Registrera dig
              </Button>
            </SimpleGrid>
          </SimpleGrid>
        </Container>
      </Center>
    </>
  );
}
