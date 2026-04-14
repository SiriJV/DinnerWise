import { Tooltip, Button } from '@mantine/core';
import type { ReactNode } from 'react';

type TooltipButtonProps = {
  disabled: boolean;
  tooltip: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
};

export default function TooltipButton({
  disabled,
  tooltip,
  children,
  onClick,
  variant,
}: TooltipButtonProps) {
  const button = (
    <Button disabled={disabled} onClick={onClick} variant={variant as any}>
      {children}
    </Button>
  );

  if (!disabled) return button;

  return (
    <Tooltip label={tooltip} withArrow>
      {button}
    </Tooltip>
  );
}
