import {
  Container,
  Text,
  Group,
  Stack,
  Anchor,
  TextInput,
  Button,
  SimpleGrid,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import './Footer.scss';
import { getAccordionItems } from '../../data/AccordionItems';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { useState } from 'react';

export default function Footer() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isLoggedIn, logout } = useAuth();
  const { openLogin, openCreate } = useModal();
  const accordionItems = getAccordionItems(isLoggedIn);

  const [emailTo, setEmailTo] = useState('');
  const [name, setName] = useState('');
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
    <footer className='footer'>
      <Container size='lg'>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing='md' pb='xl'>
          <Stack className='newsletter-stack'>
            <Text fw={600}>Håll dig uppdaterad!</Text>
            <Text size='sm'>
              Skriv upp dig på vårt nyhetsbrev för att få de senaste
              uppdateringarna, tipsen och exklusiva erbjudanden direkt i din
              inkorg
            </Text>
          </Stack>

          <Stack justify='flex-end'>
            <SimpleGrid
              cols={{ base: 1, sm: 3 }}
              spacing='xs'
              style={{ alignItems: 'flex-end' }}>
              <TextInput
                label='Namn'
                placeholder='Anna Svensson'
                radius='sm'
                value={name}
                required
                onChange={(event) => {
                  setName(event.currentTarget.value);
                }}
              />

              <TextInput
                label='E-post'
                placeholder='exempel@epost.se'
                value={emailTo}
                required
                onChange={(event) => {
                  setEmailTo(event.currentTarget.value);
                }}
              />

              <Button onClick={handleSendEmail} disabled={!name || !emailTo}>
                Registrera dig
              </Button>
            </SimpleGrid>
          </Stack>
        </SimpleGrid>

        {isMobile ? (
          <Stack gap='md' pt='xl' pb='xl'>
            <Stack gap='xs' className='footer-brand'>
              <Text fw={700} size='lg'>
                DinnerWise
              </Text>
              <Text size='xs' c='dimmed'>
                Små event, stora upplevelser.
              </Text>
            </Stack>
            <NavBarAccordion />
          </Stack>
        ) : (
          <Group align='flex-start' justify='space-between' pt='xl' pb='xl'>
            <Stack gap='xs' className='footer-brand'>
              <Text fw={700} size='lg'>
                DinnerWise
              </Text>
              <Text size='xs' c='dimmed'>
                Små event, stora upplevelser.
              </Text>
            </Stack>

            <Group className='footer-groups' align='flex-start' wrap='wrap'>
              {accordionItems.map((group, groupIdx) => (
                <Stack
                  key={group.value || group.label || groupIdx}
                  gap={6}
                  className='footer-group'>
                  <Text fw={600} className='footer-title'>
                    {group.label}
                  </Text>

                  {group.panels.map((link, linkIdx) => {
                    const uniqueKey = `${link.label || ''}-${link.path || ''}-${linkIdx}`;
                    if (link.modal === 'login') {
                      return (
                        <button
                          key={uniqueKey}
                          className='footer-link'
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          onClick={openLogin}>
                          {link.label}
                        </button>
                      );
                    }
                    if (link.modal === 'create') {
                      return (
                        <button
                          key={uniqueKey}
                          className='footer-link'
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          onClick={openCreate}>
                          {link.label}
                        </button>
                      );
                    }
                    if (link.modal === 'logout') {
                      return (
                        <button
                          key={uniqueKey}
                          className='footer-link'
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          onClick={logout}>
                          {link.label}
                        </button>
                      );
                    }
                    return (
                      <NavLink
                        key={uniqueKey}
                        to={link.path}
                        className='footer-link'>
                        {link.label}
                      </NavLink>
                    );
                  })}
                </Stack>
              ))}
            </Group>
          </Group>
        )}
      </Container>

      <Container size='lg'>
        <Group
          justify='space-between'
          align='center'
          py='md'
          className='footer-bottom'
          wrap='wrap'>
          <Text size='xs' c='dimmed'>
            © 2026 DinnerWise. All rights reserved.
          </Text>

          <Group gap='md'>
            <Anchor
              component={NavLink}
              to='/kopvillkor'
              size='xs'
              c='dimmed'
              underline='hover'>
              Köpvillkor
            </Anchor>

            <Anchor
              component={NavLink}
              to='/integritetspolicy'
              size='xs'
              c='dimmed'
              underline='hover'>
              Integritetspolicy
            </Anchor>

            <Anchor
              component={NavLink}
              to='/cookies'
              size='xs'
              c='dimmed'
              underline='hover'>
              Cookies
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
