import { Badge } from '@mantine/core';

interface FollowBadgeProps {
  following: boolean;
}

export default function FollowBadge({ following }: FollowBadgeProps) {
  if (following) {
    return <Badge size='lg'>Följer</Badge>;
  }
  return (
    <Badge size='lg' variant='light'>
      Följ
    </Badge>
  );
}
