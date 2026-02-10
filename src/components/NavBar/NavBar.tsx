import {
  Stack,
  Text,
  UnstyledButton,
  Divider,
  Space,
  Container,
  Group,
  Anchor,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import LoginButtons from '../Buttons/LoginButtons/LoginButtons';
import './NavBar.scss';
import { useEffect, useState } from 'react';
import { generateCategorySlug } from '../../utils/slugify';
import { fetchCategories, type Category } from '../../api/categories';

interface NavBarProps {
  opened: boolean;
  onClose: () => void;
}

export default function NavBar({ opened, onClose }: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  if (!opened) return null;

  return (
    <>
      <div className='navOverlay' onClick={onClose} />

      <nav className='sideNav'>
        <Stack className='sideNavInner'>
          <Text fw={800} size='lg' px='md' pt='md'>
            Utforska efter kategori
          </Text>

          <Stack gap={15} px='md'>
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/kategori/${generateCategorySlug(category.name)}`}
                className={({ isActive }) =>
                  `sideNavLink ${isActive ? 'active' : ''}`
                }
                onClick={onClose}>
                <UnstyledButton className='sideNavButton'>
                  {category.name}
                </UnstyledButton>
              </NavLink>
            ))}
          </Stack>

          {/* <Divider my='sm' /> */}
          <Space h='xs' />

          {/* <Text fw={800} size='lg' px='md' pt='md'>
            Om DinnerWise
            </Text> */}
          <NavBarAccordion onClose={onClose} />

          <Space h='xs' />
          <LoginButtons onClose={onClose} />

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
                <Anchor
                  component={NavLink}
                  to='/kopvillkor'
                  size='sm'
                  c='dimmed'
                  underline='hover'>
                  Köpvillkor
                </Anchor>

                <Anchor
                  component={NavLink}
                  to='/integritetspolicy'
                  size='sm'
                  c='dimmed'
                  underline='hover'>
                  Integritetspolicy
                </Anchor>

                <Anchor
                  component={NavLink}
                  to='/cookies'
                  size='sm'
                  c='dimmed'
                  underline='hover'>
                  Cookies
                </Anchor>
              </Group>
            </Group>
          </Container>
        </Stack>
      </nav>
    </>
  );
}
