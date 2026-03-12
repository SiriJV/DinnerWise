import { Stack, TextInput, Text, Textarea, Group } from '@mantine/core';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
import { Mail } from 'lucide-react';
import { useState } from 'react';

type ShareByEmailProps = { eventName: string; generatedUrl: string };

export default function ShareByEmail({
  eventName,
  generatedUrl,
}: ShareByEmailProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [event, setEvent] = useState(eventName);
  const [firstName, setFirstName] = useState('');
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
    // Split emails by comma, trim whitespace
    const emails = emailTo
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e);
    if (emails.length === 0 || !emailMessage || !emails.every(isValidEmail)) {
      alert('Skriv in giltiga e-postadresser och meddelande');
      return;
    }

    try {
      // Send email to each address
      for (const to of emails) {
        const response = await fetch(
          'http://localhost:3001/email/send-share-email',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to,
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
      //   alert('Mejl skickat!'); // enkel feedback
    } catch (err) {
      console.error('Fetch failed', err);
      alert('Något gick fel med mejlet');
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            backgroundColor: 'rgba(36, 56, 33, 1)',
            color: 'white',
            cursor: 'pointer',
            minHeight: '50px',
            paddingBlock: 'var(--mantine-spacing-md)',
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
              <TextInput
                label='Till (e-post)'
                required
                placeholder='mottagare@email.com'
                type='text'
                value={emailTo}
                maxLength={120}
                onChange={(e) => setEmailTo(e.currentTarget.value)}
                // error={
                //   emailTo &&
                //   emailTo
                //     .split(',')
                //     .some((e) => e.trim() && !isValidEmail(e.trim()))
                //     ? 'Ogiltig e-postadress'
                //     : ''
                // }
                radius='xs'
              />
              <TextInput
                label='Ditt namn'
                placeholder='Ditt namn'
                value={firstName}
                maxLength={30}
                onChange={handleNameChange}
                radius='xs'
              />
              <Textarea
                label='Meddelande'
                placeholder='Skriv ditt meddelande här...'
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.currentTarget.value)}
                minRows={2}
                maxRows={4}
                maxLength={300}
                radius='xs'
              />
              <Group gap='sm' justify='flex-end'>
                <BaseButton
                  variantType='secondary'
                  onClick={() => setShowEmailForm(false)}>
                  Avbryt
                </BaseButton>
                <BaseButton
                  variantType='primary'
                  onClick={handleSendEmail}
                  disabled={
                    !emailTo || !emailMessage || !isValidEmail(emailTo)
                  }>
                  Skicka
                </BaseButton>
              </Group>
            </>
          )}
        </Stack>
      )}
    </>
  );
}
