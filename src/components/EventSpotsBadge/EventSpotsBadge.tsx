import { Badge } from '@mantine/core';

type EventSpotsBadgeProps = {
  currentParticipants: number;
  maxParticipants: number;
  className?: string;
  size: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
};

export default function EventSpotsBadge({
  currentParticipants,
  maxParticipants,
  className,
  size,
}: EventSpotsBadgeProps) {
  const remainingSpots = maxParticipants - currentParticipants;
  const isFull = remainingSpots <= 0;
  const isAlmostFull = remainingSpots > 0 && remainingSpots <= 2;

  const backgroundColor = isFull
    ? 'rgba(255, 204, 199, 1)'
    : isAlmostFull
      ? 'rgba(255, 238, 186, 1)'
      : 'rgba(216, 227, 222, 1)';

  const textColor = isFull
    ? 'rgba(116, 39, 62, 1)'
    : isAlmostFull
      ? 'rgba(120, 90, 10, 1)'
      : 'rgba(36, 56, 33, 1)';

  const label = isFull
    ? `Fullt (${maxParticipants}/${maxParticipants})`
    : `${currentParticipants} ${currentParticipants === 1 ? 'anmäld' : 'anmälda'}, ${remainingSpots} ${
        remainingSpots === 1 ? 'plats' : 'platser'
      } kvar`;

  return (
    <Badge bg={backgroundColor} c={textColor} size={size} className={className}>
      {label}
    </Badge>
  );
}
