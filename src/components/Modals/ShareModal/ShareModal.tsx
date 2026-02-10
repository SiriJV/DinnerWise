import { Modal, Text, Group, Stack, TextInput, Textarea } from '@mantine/core';
import { Mail, Link } from 'lucide-react';
import { useState } from 'react';
import BaseButton from '../../Buttons/BaseButton/BaseButton';
// import './ShareModal.scss';

interface ShareModalProps {
  opened: boolean;
  onClose: () => void;
  eventUrl?: string;
}

export default function ShareModal({
  opened,
  onClose,
  eventUrl = 'https://dinnerwise.se/event',
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEmailClick = () => {
    setShowEmailForm(!showEmailForm);
    setEmailSent(false);
  };

  const handleSendEmail = () => {
    // Demo - ingen faktisk funktionalitet
    console.log('Skickar email till:', emailTo, 'Meddelande:', emailMessage);
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailForm(false);
      setEmailTo('');
      setEmailMessage('');
      setEmailSent(false);
    }, 2000);
  };

  return (
    <Modal
      size='sm'
      opened={opened}
      onClose={onClose}
      title={
        <Group gap='md' wrap='nowrap' className='modal-title-group'>
          <Text fw={600}>Dela event</Text>
        </Group>
      }
      centered>
      <Stack gap='md'>
        <TextInput
          label='Kopiera länk'
          value={copied ? 'Kopierad!' : eventUrl}
          variant='filled'
          readOnly
          radius='xs'
          leftSection={
            <div
              onClick={handleCopyLink}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              }}>
              <Link size={18} />
            </div>
          }
          onClick={handleCopyLink}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-gray-0)',
              cursor: 'pointer',
              minHeight: '50px',
              paddingBlock: 'var(--mantine-spacing-md)',
            },
          }}
        />
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
                  placeholder='mottagare@email.com'
                  type='email'
                  value={emailTo}
                  maxLength={40}
                  onChange={(e) => setEmailTo(e.currentTarget.value)}
                  error={
                    emailTo && !isValidEmail(emailTo)
                      ? 'Ogiltig e-postadress'
                      : ''
                  }
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
        <TextInput
          label='Facebook'
          value='Dela på Facebook'
          variant='filled'
          readOnly
          radius='xs'
          leftSection={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
              }}>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='white'
                xmlns='http://www.w3.org/2000/svg'
                style={{ display: 'block', overflow: 'visible' }}>
                <path d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' />
              </svg>
            </div>
          }
          styles={{
            input: {
              backgroundColor: 'rgba(36, 56, 33, 1)',
              color: 'white',
              cursor: 'default',
              pointerEvents: 'none',
              minHeight: '50px',
              paddingBlock: 'var(--mantine-spacing-md)',
            },
          }}
        />
        <TextInput
          label='Twitter/X'
          value='Dela på Twitter/X'
          variant='filled'
          readOnly
          radius='xs'
          leftSection={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='white'
                xmlns='http://www.w3.org/2000/svg'
                style={{ display: 'block' }}>
                <path d='M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z' />
              </svg>
            </div>
          }
          styles={{
            input: {
              backgroundColor: 'rgba(36, 56, 33, 1)',
              color: 'white',
              cursor: 'default',
              pointerEvents: 'none',
              minHeight: '50px',
              paddingBlock: 'var(--mantine-spacing-md)',
            },
          }}
        />
      </Stack>
    </Modal>
  );
}
