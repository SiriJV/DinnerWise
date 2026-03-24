import {
  Stack,
  Text,
  UnstyledButton,
  Space,
  Group,
  Drawer,
} from '@mantine/core';
import { Link, NavLink } from 'react-router-dom';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import LoginButtons from '../Buttons/LoginButtons/LoginButtons';
import './NavBar.scss';
import { useEffect, useState } from 'react';
import { slugify } from '../../utils/slugify';
import { Brain } from 'lucide-react';
import { useMediaQuery } from '@mantine/hooks';
import { APP_CONFIG } from '../../config/appConfig';

type Category = {
  id: number;
  name: string;
  description?: string;
  cover_picture_url?: string;
};

interface NavBarProps {
  opened: boolean;
  onClose: () => void;
  offset?: number;
  onClickCreate?: () => void;
}

export default function NavBar({ opened, onClose }: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const isMobile = useMediaQuery('(max-width: 48em)');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('http://localhost:3001/categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  if (!opened) return null;

  return (
    <>
      <Drawer
        size={isMobile ? 'xs' : 'sm'}
        opened={opened}
        onClose={onClose}
        zIndex={2000}
        title={<Brain color='rgba(211, 4, 59, 1)' />}>
        <Stack px='md' align='stretch'>
          <Text fw={800} size='lg' pt='md'>
            Utforska efter kategori
          </Text>
          <Stack gap={15}>
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/kategori/${slugify(category.name)}`}
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

          <NavBarAccordion onClose={onClose} />
          <Space h='xs' />
          <LoginButtons onClose={onClose} />

          {/* <Container size='lg'> */}
          <Stack
            justify='center'
            align='center'
            // wrap='wrap'
            className='footer-bottom'
            style={{ width: '100%' }}>
            <Text size='xs' c='dimmed'>
              © 2026 {APP_CONFIG.brandName}. All rights reserved.
            </Text>

            <Group gap='md' w='100%' justify='space-around'>
              <Link
                to='/kopvillkor'
                style={{ textDecoration: 'none' }}
                onClick={onClose}>
                <Text size='xs' c='dimmed' className='link-hover'>
                  Köpvillkor
                </Text>
              </Link>

              <Link
                to='/integritetspolicy'
                style={{ textDecoration: 'none' }}
                onClick={onClose}>
                <Text size='xs' c='dimmed' className='link-hover'>
                  Integritetspolicy
                </Text>
              </Link>

              <Link
                to='/cookies'
                style={{ textDecoration: 'none' }}
                onClick={onClose}>
                <Text size='xs' c='dimmed' className='link-hover'>
                  Cookies
                </Text>
              </Link>
            </Group>
          </Stack>
          {/* </Container> */}
        </Stack>
      </Drawer>
    </>
  );
}
