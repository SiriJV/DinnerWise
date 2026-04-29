import type { ReactNode } from 'react';
import { Box, Stack } from '@mantine/core';
import './AuthLayout.scss';

interface AuthLayoutProps {
  children: ReactNode;
  maxWidth?: number;
}

export default function AuthLayout({ children, maxWidth = 460 }: AuthLayoutProps) {
  return (
    <Box className="auth-layout">
      <Box className="auth-layout__inner" style={{ maxWidth }}>
        <Stack gap="md">
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
