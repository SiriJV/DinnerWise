import {
  Stack,
  Text,
  UnstyledButton,
  Space,
  Group,
  Anchor,
  Drawer,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import NavBarAccordion from '../NavBarAccordion/NavBarAccordion';
import LoginButtons from '../Buttons/LoginButtons/LoginButtons';
import './NavBar.scss';
import { useEffect, useState } from 'react';
import { slugify } from '../../utils/slugify';
import { Brain } from 'lucide-react';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '../../contexts/AuthContext';
import BaseButton from '../Buttons/BaseButton/BaseButton';
import { useModal } from '../../contexts/ModalContext';
import CreateEventModal from '../Modals/CreateEventModal/CreateEventModal';
import CreateEventLoginModal from '../Modals/CreateEventModal/CreateEventLoginModal';

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

export default function NavBar({
  opened,
  onClose,
  onClickCreate,
}: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [modalOpened, setModalOpened] = useState(false);
  const { isLoggedIn } = useAuth();

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

          {/* <BaseButton variant='primary' onClick={openCreate}>
          Skapa event
        </BaseButton>
        <Space h='xs' /> */}

          {/* <Anchor
            variant='subtle'
            c='red'
            size='md'
            onClick={() => {
              // först öppna modal
              setModalOpened(true);

              // sedan stäng drawer nästa tick
              setTimeout(() => {
                onClose();
              }, 0);
            }}
            style={{ cursor: 'pointer' }}>
            Skapa event
          </Anchor> */}

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
              © 2026 DinnerWise. All rights reserved.
            </Text>

            <Group gap='md' w='100%' justify='space-around'>
              <Anchor
                component={NavLink}
                to='/kopvillkor'
                size='xs'
                c='dimmed'
                underline='hover'
                onClick={onClose}>
                Köpvillkor
              </Anchor>

              <Anchor
                component={NavLink}
                to='/integritetspolicy'
                size='xs'
                c='dimmed'
                underline='hover'
                onClick={onClose}>
                Integritetspolicy
              </Anchor>

              <Anchor
                component={NavLink}
                to='/cookies'
                size='xs'
                c='dimmed'
                underline='hover'
                onClick={onClose}>
                Cookies
              </Anchor>
            </Group>
          </Stack>
          {/* </Container> */}
        </Stack>
      </Drawer>
      {/* {isLoggedIn ? (
        <CreateEventModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        />
      ) : (
        <CreateEventLoginModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
        />
      )} */}
    </>
  );
}
