import { Button, type ButtonProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './BaseButton.scss';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps extends ButtonProps {
  variantType?: Variant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  onClose?: () => void;
}

export default function BaseButton({
  variantType = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  to,
  onClick,
  onClose, // <-- ta emot onClose
  ...props
}: BaseButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick();
    }
  };

  const buttonClassName = `baseButton baseButton--${variantType} baseButton--${size} ${
    fullWidth ? 'baseButton--full' : ''
  } ${className}`;

  return (
    <Button
      unstyled
      className={buttonClassName}
      onClick={handleClick}
      {...props}>
      {children}
    </Button>
  );
}
