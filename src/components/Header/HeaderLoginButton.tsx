import { ActionIcon, Text } from '@mantine/core';
import { UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface HeaderLoginButtonProps {
  loggedIn: boolean;
}

export default function HeaderLoginButton({
  loggedIn,
}: HeaderLoginButtonProps) {
  if (loggedIn) {
    return (
      <ActionIcon
        component={NavLink}
        to='/profil/anna_s'
        variant='subtle'
        color='white'
        size='md'>
        <UserRound size={20} />
      </ActionIcon>
    );
  }
  return (
    <NavLink to='/logga-in' color='white' style={{ textDecoration: 'none' }}>
      <Text c='white'>Logga in</Text>
    </NavLink>
  );
}
