import { Button, type ButtonProps } from '@mantine/core';
import type { ReactNode } from 'react';
import './BaseButton.scss';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps extends ButtonProps {
  variantType?: Variant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function BaseButton({
  variantType = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: BaseButtonProps) {
  const buttonClassName = `baseButton baseButton--${variantType} baseButton--${size} ${
    fullWidth ? 'baseButton--full' : ''
  } ${className}`;

  return (
    <Button unstyled className={buttonClassName} {...props}>
      {children}
    </Button>
  );
}
