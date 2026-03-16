import { AspectRatio, Group, Center, Stack, Text } from '@mantine/core';
import type { LucideProps } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface NotificationsContentProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  text: string;
  minutes?: number;
  hours?: number;
  date?: string;
  path?: string;
}

export default function NotificationsContent({
  icon: Icon,
  title,
  text,
  minutes,
  hours,
  date,
  path,
}: NotificationsContentProps) {
  const getTimeText = () => {
    if (minutes) return `${minutes}m`;
    if (hours) return `${hours}h`;
    if (date) return date;
    return '';
  };

  const content = (
    <Group wrap='nowrap'>
      <AspectRatio ratio={1 / 1} miw={40} mih={40}>
        <Center bdrs={100} bg='gray.1' miw={40} mih={40} bd='solid 1px gray.3'>
          <Icon size={20} color='black' />
        </Center>
      </AspectRatio>
      <Stack gap='0'>
        <Text size='xs' fw={600}>
          {title}
        </Text>
        <Text size='xs'>
          {text}
          {getTimeText() && (
            <Text span size='xs' c='dimmed'>
              {' '}
              {getTimeText()}
            </Text>
          )}
        </Text>
      </Stack>
    </Group>
  );
  return path ? (
    <Link
      to={path}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      {content}
    </Link>
  ) : (
    content
  );
}
