import { Modal, Text, Group, Stack, Avatar, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ProfilePageFollowersCard from './ProfilePageFollowersCard';

interface ProfilePageFollowersModalProps {
  opened?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  onBack?: () => void;
}

export default function ProfilePageFollowersModal({}: ProfilePageFollowersModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return {
    modal: (
      <Modal opened={opened} onClose={close} title='Följare' centered>
        <Stack>
          <ProfilePageFollowersCard alias='anna_s' name='Anna Svensson' />
          <ProfilePageFollowersCard
            alias='erik_l'
            name='Erik Larsson'
            following={true}
          />
        </Stack>
      </Modal>
    ),
    open,
  };
}
