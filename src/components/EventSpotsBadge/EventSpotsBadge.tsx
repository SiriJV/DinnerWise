import { Badge } from '@mantine/core';
import { useIsMobile } from '../../hooks/useResponsive';

type EventSpotsBadgeProps = {
  currentParticipants: number;
  maxParticipants: number;
  className?: string;
  size: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'responsive';
};

export default function EventSpotsBadge({
  currentParticipants,
  maxParticipants,
  className,
  size,
}: EventSpotsBadgeProps) {
  const isMobile = useIsMobile();
  const badgeSize = size === 'responsive' ? (isMobile ? 'lg' : 'xl') : size;
  const remainingSpots = maxParticipants - currentParticipants;
  const isFull = remainingSpots <= 0;
  const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

  const backgroundColor = isFull
    ? 'var(--mantine-color-lightred-5)'
    : isAlmostFull
      ? 'var(--mantine-color-yellow-5)'
      : 'var(--mantine-color-darkgreen-1)';

  const textColor = isFull
    ? 'var(--mantine-color-darkred-5)'
    : isAlmostFull
      ? 'var(--mantine-color-yellow-9)'
      : 'var(--mantine-color-darkgreen-5)';

  const label = isFull
    ? `Fullt (${maxParticipants}/${maxParticipants})`
    : `${currentParticipants} ${currentParticipants === 1 ? 'anmäld' : 'anmälda'}, ${remainingSpots} ${
        remainingSpots === 1 ? 'plats' : 'platser'
      } kvar`;

  return (
    <Badge
      bg={backgroundColor}
      c={textColor}
      size={badgeSize}
      className={className}>
      {label}
    </Badge>
  );
}
