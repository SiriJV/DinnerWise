import { Text, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router-dom';

interface FooterLinkProps {
  label: string;
  to?: string;
  onClick?: () => void;
}

export default function FooterLink({ label, to, onClick }: FooterLinkProps) {
  // 👉 Navigation link
  if (to) {
    return (
      <Text component='span' size='sm' c='dimmed' className='link-hover'>
        <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
          {label}
        </Link>
      </Text>
    );
  }

  // 👉 Action (login, create, logout etc)
  return (
    <UnstyledButton onClick={onClick}>
      <Text
        size='sm'
        c='dimmed'
        className='link-hover'
        style={{ cursor: 'pointer' }}>
        {label}
      </Text>
    </UnstyledButton>
  );
}
