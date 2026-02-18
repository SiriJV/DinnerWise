import {
  Container,
  Text,
  Group,
  Stack,
  Anchor,
  TextInput,
  Button,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import './Footer.scss';
import { getAccordionItems } from '../../data/AccordionItems';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';

export default function Footer() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isLoggedIn, logout } = useAuth();
  const { openLogin, openCreate } = useModal();
  const accordionItems = getAccordionItems(isLoggedIn);

  return (
    <footer className='footer'>
      <Container size='lg'>
        {isMobile ? (
          <Stack gap='md' pb='xl' className='newsletter-group'>
            <Stack className='newsletter-stack'>
              <Text fw={600}>Håll dig uppdaterad!</Text>
              <Text size='sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Stack>

            <Group style={{ width: '100%' }} gap={0}>
              <TextInput
                className='newsletter-input'
                placeholder='exempel@epost.se'
                radius='0'
              />
              <Button className='newsletter-button'>Registrera dig</Button>
            </Group>
          </Stack>
        ) : (
          <Group align='flex-end' gap='md' pb='xl' className='newsletter-group'>
            <Stack className='newsletter-stack'>
              <Text fw={600}>Håll dig uppdaterad!</Text>
              <Text size='sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </Stack>

            <Group style={{ flex: 1, maxWidth: '50%' }} gap={0}>
              <TextInput
                className='newsletter-input'
                placeholder='exempel@epost.se'
                radius='0'
              />
              <Button className='newsletter-button'>Registrera dig</Button>
            </Group>
          </Group>
        )}

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
