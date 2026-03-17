import { Rating } from '@mantine/core';

type RatingComponentProps = {
  value: number;
  readOnly?: boolean;
};

export default function RatingComponent({
  value,
  readOnly,
}: RatingComponentProps) {
  return (
    <Rating
      value={value}
      fractions={2}
      readOnly={readOnly}
      color='rgba(211, 4, 59, 1)'
    />
  );
}
