import {
  Container,
  Text,
  Group,
  Stack,
  SimpleGrid,
  Box,
  Grid,
} from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import './Footer.scss';
import { getAccordionItems } from '../../data/AccordionItems';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import NewsLetterCTA from '../NewsLetterCTA/NewsLetterCTA';
import { APP_CONFIG } from '../../config/appConfig';

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();
  const { openLogin, openCreate } = useModal();
  const accordionItems = getAccordionItems(isLoggedIn);

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <footer className='footer'>
        {!isHomePage && <NewsLetterCTA />}
        <Container size='lg'>
          {/* Footer content */}
          <Grid pt='xl' pb='xl'>
            {/* Brand */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack gap='xs'>
                <Text fw={700} size='lg'>
                  {APP_CONFIG.brandName}
                </Text>
                <Text size='xs' c='dimmed'>
                  Små event, stora upplevelser.
                </Text>
                <Box hiddenFrom='sm'>
                  <NavBarAccordion />
                </Box>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}>
              {/* Links */}
              <SimpleGrid cols={{ base: 5 }} spacing='lg' visibleFrom='sm'>
                {accordionItems.map((group, groupIdx) => (
                  <Stack key={group.value || group.label || groupIdx} gap={6}>
                    <Text fw={600}>{group.label}</Text>

                    {group.panels.map((link, linkIdx) => {
                      const key = `${link.label}-${linkIdx}`;

                      if (link.modal === 'login') {
                        return (
                          <Text
                            key={key}
                            className='footer-link'
                            onClick={() => openLogin()}
                            style={{ cursor: 'pointer' }}>
                            {link.label}
                          </Text>
                        );
                      }

                      if (link.modal === 'create') {
                        return (
                          <Text
                            key={key}
                            className='footer-link'
                            onClick={openCreate}
                            style={{ cursor: 'pointer' }}>
                            {link.label}
                          </Text>
                        );
                      }

                      if (link.modal === 'logout') {
                        return (
                          <Text
                            key={key}
                            className='footer-link'
                            onClick={logout}
                            style={{ cursor: 'pointer' }}>
                            {link.label}
                          </Text>
                        );
                      }

                      return (
                        <Link key={key} to={link.path} className='footer-link'>
                          {link.label}
                        </Link>
                      );
                    })}
                  </Stack>
                ))}
              </SimpleGrid>
            </Grid.Col>
          </Grid>
        </Container>

        {/* Bottom bar */}
        <Container size='lg'>
          <Group justify='space-between' py='md' wrap='wrap'>
            <Text size='xs' c='dimmed'>
              © 2026 {APP_CONFIG.brandName}. All rights reserved.
            </Text>

            <Group gap='md'>
              <Link to='/kopvillkor' style={{ textDecoration: 'none' }}>
                <Text size='xs' c='red' className='link-hover'>
                  Köpvillkor
                </Text>
              </Link>
              <Link to='/integritetspolicy' style={{ textDecoration: 'none' }}>
                <Text size='xs' c='red' className='link-hover'>
                  Integritetspolicy
                </Text>
              </Link>
              <Link to='/cookies' style={{ textDecoration: 'none' }}>
                <Text size='xs' c='red' className='link-hover'>
                  Cookies
                </Text>
              </Link>
            </Group>
          </Group>
        </Container>
      </footer>
    </>
  );
}
