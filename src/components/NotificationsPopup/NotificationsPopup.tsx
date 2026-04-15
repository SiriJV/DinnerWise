import {
  ActionIcon,
  CloseButton,
  Group,
  Indicator,
  Popover,
  Stack,
  Text,
} from '@mantine/core';
import { BellIcon, ChevronLeft, Settings } from 'lucide-react';
import { useState } from 'react';
import NotificationsContent from './NotificationsContent';
import { mockNotifications } from './mocknotifications';
import NotificationsSettingsContent from './NotificationsSettingsContent';

export default function NotificationsPopup() {
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [read, setRead] = useState(false);

  const [view, setView] = useState<'notifications' | 'settings'>(
    'notifications',
  );

  const todayNotifications = notifications.filter(
    (n) => n.minutes !== undefined || n.hours !== undefined,
  );

  const olderNotifications = notifications.filter((n) => n.date !== undefined);

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover
      width={'90%'}
      position='bottom'
      withArrow
      shadow='md'
      opened={opened}
      onChange={(o) => {
        setOpened(o);
        if (!o) {
          setTimeout(() => setView('notifications'), 300);
        }
      }}>
      <Popover.Target>
        <Indicator color='white' size={7} disabled={read}>
          <ActionIcon
            variant='subtle'
            color='white'
            size='md'
            onClick={() => {
              setOpened((o) => !o);
              setRead(true);
            }}>
            <BellIcon size={20} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>

      <Popover.Dropdown
        h={'80%'}
        mah={750}
        maw={350}
        style={{ overflowY: 'auto', width: '100%' }}>
        <Stack>
          <Group justify='space-between' align='flex-end'>
            <Text size='md' fw={600}>
              {view === 'notifications' ? 'Notiser' : 'Notisinställningar'}
            </Text>

            <Group gap='xs'>
              {view === 'settings' && (
                <ChevronLeft
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setView('notifications')}
                />
              )}

              {view === 'notifications' && (
                <Settings
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setView('settings')}
                />
              )}

              <CloseButton
                onClick={(o) => {
                  setOpened(false);
                  setTimeout(() => setView('notifications'), 300);
                }}
              />
            </Group>
          </Group>

          {/* NOTIFICATIONS VIEW */}
          {view === 'notifications' ? (
            notifications.length === 0 ? (
              <Text size='sm' c='dimmed' ta='center' py='md'>
                Inga nya notiser
              </Text>
            ) : (
              <>
                <Group justify='space-between' align='flex-end'>
                  <Text size='sm' fw={600}>
                    Idag
                  </Text>

                  <Text
                    size='xs'
                    onClick={handleClearAll}
                    style={{ cursor: 'pointer' }}>
                    Rensa alla
                  </Text>
                </Group>

                <Stack gap='md'>
                  {todayNotifications.map((n, i) => (
                    <NotificationsContent key={n.title + i} {...n} />
                  ))}
                </Stack>

                <Text size='sm' fw={600} mt='md'>
                  Senaste 30 dagarna
                </Text>

                <Stack gap='md' mb='xs'>
                  {olderNotifications.map((n, i) => (
                    <NotificationsContent key={n.title + i} {...n} />
                  ))}
                </Stack>
              </>
            )
          ) : (
            // SETTINGS VIEW
            <NotificationsSettingsContent />
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
