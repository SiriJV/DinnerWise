import { Rating } from '@mantine/core';

type RatingComponentProps = {
  value: number;
  fractions: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
};

export default function RatingComponent({
  value,
  fractions,
  readOnly,
  onChange,
}: RatingComponentProps) {
  return (
    <Rating
      value={value}
      fractions={fractions}
      readOnly={readOnly}
      onChange={onChange}
      color='red'
    />
  );
}
