import {
  Stack,
  TextInput,
  Text,
  Textarea,
  Group,
  Button,
  Box,
} from '@mantine/core';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { validateEmail } from '../../../utils/formValidation';
import { useFormTouched } from '../../../hooks/useFormTouched';
import { getApiEndpoint } from '../../../api/config';

type ShareByEmailProps = { eventName: string; generatedUrl: string };

export default function ShareByEmail({
  eventName,
  generatedUrl,
}: ShareByEmailProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const event = eventName;
  const [firstName, setFirstName] = useState('');
  const { isTouched, handleBlur } = useFormTouched();
  const { isValid: isEmailValid, error: emailError } = validateEmail(emailTo);

  const defaultMessage = `Din vän vill gå på ${eventName} med dig!`;
  const [emailMessage, setEmailMessage] = useState(defaultMessage);

  // Uppdatera emailMessage automatiskt när namn ändras
  const updateEmailMessage = (name: string, eventName: string) => {
    setEmailMessage(`Din vän ${name || ''} vill gå på ${eventName} med dig!`);
  };

  // Hantera ändring av namn
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.currentTarget.value);
    updateEmailMessage(e.currentTarget.value, event);
  };

  // Funktion för att skicka share-mejl via backend
  const handleSendEmail = async () => {
    if (!emailMessage || !isEmailValid) {
      alert('Skriv in giltiga e-postadresser och meddelande');
      return;
    }

    try {
      {
        const response = await fetch(
          getApiEndpoint('/email/send-share-email'),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: emailTo,
              name: firstName || 'Vän',
              event: event || 'Event',
              path: generatedUrl,
              emailMessage,
            }),
          },
        );
        const data = await response.json();
        console.log('Mail skickat:', data);
      }
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailForm(false);
        setEmailTo('');
        setEmailMessage(defaultMessage);
        setEmailSent(false);
      }, 2000);
    } catch (err) {
      console.error('Fetch failed', err);
      alert('Något gick fel med mejlet');
    }
  };

  const handleEmailClick = () => {
    setShowEmailForm(!showEmailForm);
    setEmailSent(false);
    if (!showEmailForm) {
      setEmailMessage(defaultMessage);
    }
  };
  return (
    <>
      <TextInput
        label='E-post'
        value='Skicka via e-post'
        variant='filled'
        readOnly
        radius='xs'
        leftSection={<Mail size={18} color='white' />}
        onClick={handleEmailClick}
        styles={{
          input: {
            backgroundColor: 'var(--mantine-color-darkgreen-5)',
            color: 'white',
            cursor: 'pointer',
            minHeight: '50px',
            paddingBlock: 'var(--mantine-spacing-md)',
            border: 'none',
            '--input-bd-focus': 'transparent',
          },
        }}
      />
      {showEmailForm && (
        <Stack gap='md' p='md' bg='gray.0' style={{ borderRadius: '8px' }}>
          {emailSent ? (
            <Text ta='center' fw={600} c='dimmed' py='md'>
              Skickat!
            </Text>
          ) : (
            <>
              <Box>
                <TextInput
                  label='Till (e-post)'
                  required
                  placeholder={'mottagare@epost.se'}
                  name='share-email'
                  value={emailTo}
                  maxLength={120}
                  onChange={(e) => setEmailTo(e.currentTarget.value)}
                  onBlur={() => handleBlur('email')}
                  error={
                    isTouched('email') && emailTo && !isEmailValid
                      ? emailError
                      : ''
                  }
                  radius='xs'
                />
              </Box>
              <TextInput
                label='Ditt namn'
                placeholder='Ditt namn'
                name='share-name'
                value={firstName}
                maxLength={30}
                onChange={handleNameChange}
                radius='xs'
              />
              <Textarea
                label='Meddelande'
                placeholder='Skriv ditt meddelande här...'
                name='message'
                autoComplete='off'
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.currentTarget.value)}
                minRows={2}
                maxRows={4}
                maxLength={300}
                radius='xs'
              />
              <Group gap='sm' justify='flex-end'>
                <Button
                  variant='outline'
                  onClick={() => setShowEmailForm(false)}>
                  Avbryt
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={!emailTo || !emailMessage || !isEmailValid}>
                  Skicka
                </Button>
              </Group>
            </>
          )}
        </Stack>
      )}
    </>
  );
}
