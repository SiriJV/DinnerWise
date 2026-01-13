import { Container, Text, Group, Stack, Anchor } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import './Footer.scss';
import { accordionItems } from '../../data/NavLinks';

export default function Footer() {
  return (
    <footer className='footer'>
      <Container size='lg'>
        <Group align='flex-start' justify='space-between' pb='xl'>
          <Stack gap='xs' className='footer-brand'>
            <Text fw={700} size='lg'>
              DinnerWise
            </Text>
            <Text size='xs' c='dimmed'>
              Små event, stora upplevelser.
            </Text>
          </Stack>

          <Group className='footer-groups' align='flex-start' wrap='wrap'>
            {accordionItems.map((group) => (
              <Stack key={group.value} gap={6} className='footer-group'>
                <Text fw={600} className='footer-title'>
                  {group.label}
                </Text>

                {group.panels.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className='footer-link'>
                    {link.label}
                  </NavLink>
                ))}
              </Stack>
            ))}
          </Group>
        </Group>
      </Container>

      <Container size='lg'>
        <Group
          justify='space-between'
          align='center'
          py='md'
          className='footer-bottom'
          wrap='wrap'>
          <Text size='sm' c='dimmed'>
            © 2026 DinnerWise. All rights reserved.
          </Text>

          <Group gap='md'>
            <Anchor size='sm' c='dimmed' underline='never'>
              Köpvillkor
            </Anchor>

            <Anchor size='sm' c='dimmed' underline='never'>
              Integritetspolicy
            </Anchor>

            <Anchor size='sm' c='dimmed' underline='never'>
              Cookies
            </Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
