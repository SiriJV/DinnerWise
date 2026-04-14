import {
  Container,
  Text,
  SimpleGrid,
  Stack,
  TextInput,
  Button,
  Center,
  Box,
  Tooltip,
} from '@mantine/core';
import { useState } from 'react';
import { validateEmail } from '../../utils/formValidation';
import { useFormTouched } from '../../hooks/useFormTouched';
import DisabledTooltipButton from '../DisabledTooltipButton/DisabledTooltipButton';

export default function NewsLetterCTA(): React.ReactNode {
  const [name, setName] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const { isTouched, handleBlur } = useFormTouched();
  const { isValid: isEmailValid, error: emailError } = validateEmail(emailTo);
  const isDisabled = !name || !emailTo || !isEmailValid;

  const handleSendEmail = async () => {
    let hasError = false;

    if (!name.trim()) {
      hasError = true;
    }

    if (!emailTo || !isEmailValid) {
      hasError = true;
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
                inkorg.
              </Text>
            </Stack>

            <SimpleGrid
              cols={{ base: 1, xs: 2 }}
              spacing='xs'
              style={{ alignItems: 'stretch' }}>
              <Box>
                <TextInput
                  label='Namn'
                  placeholder='Anna Svensson'
                  required
                  name='nl-signup-fname'
                  autoComplete='chrome-off'
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  onBlur={() => handleBlur('name')}
                  error={isTouched('name') && !name.trim() ? 'Namn krävs' : ''}
                />
              </Box>

              <Box>
                <TextInput
                  label='E-post'
                  placeholder='exempel@epost.se'
                  required
                  name='nl-signup-mail'
                  autoComplete='chrome-off'
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.currentTarget.value)}
                  onBlur={() => handleBlur('email')}
                  error={
                    isTouched('email') && emailTo && !isEmailValid
                      ? emailError
                      : ''
                  }
                />
              </Box>

              <DisabledTooltipButton
                disabled={isDisabled}
                tooltip={'Fyll i alla fält korrekt'}
                children={<Button disabled={isDisabled}>Registrera dig</Button>}
              />
            </SimpleGrid>
          </SimpleGrid>
        </Container>
      </Center>
    </>
  );
}
