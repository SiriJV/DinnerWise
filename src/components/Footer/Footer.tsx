import {
  Container,
  Text,
  Group,
  Stack,
  SimpleGrid,
  Box,
  Grid,
  Anchor,
} from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import './Footer.scss';
import { getAccordionItems } from '../../data/AccordionItems';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import NewsLetterCTA from '../NewsLetterCTA/NewsLetterCTA';
import { APP_CONFIG } from '../../config/appConfig';
import FooterLink from './FooterLink';
import FooterFULogo from './FooterFULogo';

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
                <FooterFULogo hiddenFromSmall={false} />
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

                      let onClick;

                      if (link.modal === 'login') onClick = openLogin;
                      if (link.modal === 'create') onClick = openCreate;
                      if (link.modal === 'logout') onClick = logout;

                      return (
                        <FooterLink
                          key={key}
                          label={link.label}
                          to={!link.modal ? link.path : undefined}
                          onClick={onClick}
                        />
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
          <FooterFULogo hiddenFromSmall={true} />

          <Group justify='space-between' py='md' wrap='wrap'>
            <Text size='xs' c='dimmed'>
              © 2026 {APP_CONFIG.brandName}. All rights reserved.
            </Text>

            <Group gap='md'>
              <Group gap='md'>
                <Anchor component={Link} to='/kopvillkor' c='dimmed' size='xs'>
                  Köpvillkor
                </Anchor>
                <Anchor
                  component={Link}
                  to='/integritetspolicy'
                  c='dimmed'
                  size='xs'>
                  Integritetspolicy
                </Anchor>
                <Anchor component={Link} to='/cookies' c='dimmed' size='xs'>
                  Cookies
                </Anchor>
              </Group>
            </Group>
          </Group>
        </Container>
      </footer>
    </>
  );
}
