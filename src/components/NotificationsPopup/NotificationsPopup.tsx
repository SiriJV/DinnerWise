import {
  ActionIcon,
  CloseButton,
  Group,
  Popover,
  Stack,
  Text,
} from '@mantine/core';
import { BellIcon, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import NotificationsContent from './NotificationsContent';
import { mockNotifications } from './mocknotifications';

export default function NotificationsPopup() {
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const popoverRef = useRef<HTMLDivElement>(null);

  const todayNotifications = notifications.filter(
    (n) => n.minutes !== undefined || n.hours !== undefined,
  );
  const olderNotifications = notifications.filter((n) => n.date !== undefined);

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Stäng popover vid klick utanför
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpened(false);
      }
    };

    if (opened) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [opened]);

  return (
    <div ref={popoverRef}>
      <Popover
        width={300}
        position='bottom'
        withArrow
        shadow='md'
        opened={opened}
        onClose={() => setOpened(false)}>
        <Popover.Target>
          <ActionIcon
            variant='subtle'
            color='white'
            size='md'
            onClick={() => setOpened(!opened)}
            style={{ padding: 0, margin: 0, verticalAlign: 'middle' }}>
            <BellIcon size={20} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <Group justify='space-between' align='flex-end'>
              <Text size='md' fw={600}>
                Notiser
              </Text>
              <Group gap='xs'>
                <Settings size={20} />
                <CloseButton
                  aria-label='Stäng'
                  onClick={() => setOpened(false)}
                />
              </Group>
            </Group>
            {notifications.length === 0 ? (
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
            )}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
