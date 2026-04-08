import {
  Container,
  Title,
  Text,
  Stack,
  TextInput,
  Textarea,
  Button,
  Box,
  Group,
} from '@mantine/core';
import { APP_CONFIG } from '../../config/appConfig';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import DemoWarningText from '../../components/DemoWarningText/DemoWarningText';

export default function ContactPage(): React.ReactNode {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add functionality
    console.log('Form submitted:', formData);
  };
  return (
    <>
      <Container size='lg' pt='md'>
        <Title order={2} mb='md'>
          Kontakt{' '}
        </Title>
        <Stack>
          <DemoWarningText text='Kontaktuppgifterna är endast exempel.' />
          <Text>
            Har du frågor, feedback eller behöver hjälp? Tveka inte att kontakta
            oss! Vi finns här för att hjälpa dig och göra din upplevelse på{' '}
            {APP_CONFIG.brandName} så smidig som möjligt.{' '}
          </Text>
          <Text>
            Läs gärna vår{' '}
            <Link to='/faq' style={{ textDecoration: 'none' }}>
              <Text span c='red' className='link-hover'>
                FAQ
              </Text>
            </Link>{' '}
            först för att se om du kan få svar på dina frågor där.
          </Text>
          <Text>
            Annars når du oss via e-post på
            <Text span c='red'>
              {' '}
              {APP_CONFIG.contactEmail}{' '}
            </Text>
            eller via telefon på{' '}
            <Text span c='red'>
              {APP_CONFIG.telephone}
            </Text>
            . Du kan även skicka ett meddelande direkt till oss nedan. Vi ser
            fram emot att höra från dig!
          </Text>

          <Box mt='xl' pt='xl' style={{ borderTop: '1px solid #e9ecef' }}>
            <Title order={3} mb='md'>
              Skicka ett meddelande
            </Title>
            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
              <Stack>
                <TextInput
                  label='Namn'
                  placeholder='Ditt namn'
                  required
                  name='name'
                  maxLength={40}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.currentTarget.value })
                  }
                />
                <TextInput
                  label='E-post'
                  placeholder='Din e-postadress'
                  type='email'
                  name='email'
                  required
                  maxLength={40}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.currentTarget.value })
                  }
                />
                <Textarea
                  label='Meddelande (max 600 tecken)'
                  placeholder='Berätta vad vi kan hjälpa dig med...'
                  name='message'
                  maxLength={600}
                  required
                  minRows={4}
                  maxRows={6}
                  autosize
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.currentTarget.value })
                  }
                />
                <Group justify='flex-start'>
                  <Button type='submit'>Skicka meddelande</Button>
                </Group>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
