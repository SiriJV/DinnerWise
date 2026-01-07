import { Burger, Group } from '@mantine/core';
import './Header.scss';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function Header({ opened, onToggle }: HeaderProps) {
  return (
    <Group className='header' h='100%' px='md'>
      <Burger opened={opened} onClick={onToggle} size='sm' color='white' />
      <div className='logo'>DinnerWise</div>
    </Group>
  );
}
