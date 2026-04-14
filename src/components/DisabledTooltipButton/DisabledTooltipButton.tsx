import { Button, Tooltip } from '@mantine/core';
import type { ReactNode } from 'react';

type Props = {
  disabled: boolean;
  tooltip: string;
  children: ReactNode;
  onClick?: () => void;
};

export default function DisabledTooltipButton({
  disabled,
  tooltip,
  children,
  onClick,
}: Props) {
  const button = (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );

  if (!disabled) return button;

  return <Tooltip label={tooltip}>{button}</Tooltip>;
}
