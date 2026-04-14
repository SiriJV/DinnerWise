import { Tooltip, Button } from '@mantine/core';
import type { ReactNode } from 'react';

type Props = {
  disabled: boolean;
  tooltip: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
};

export default function DisabledTooltipButton({
  disabled,
  tooltip,
  children,
  onClick,
  variant,
}: Props) {
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
