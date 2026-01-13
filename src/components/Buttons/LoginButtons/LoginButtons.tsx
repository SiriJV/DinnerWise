import { Stack, Text } from '@mantine/core';
import BaseButton from '../BaseButton/BaseButton';

type LoginButtonsProps = {
  onClose: () => void;
};

export default function LoginButtons({ onClose }: LoginButtonsProps) {
  return (
    <Stack gap='xs' align='stretch' p='md'>
      <Text fw={600} ta='left'>
        Välkommen till DinnerWise
      </Text>
      <Stack gap='xs'>
        <BaseButton
          variantType='primary'
          fullWidth
          onClose={onClose}
          to='/logga-in'>
          Logga in
        </BaseButton>

        <BaseButton
          variantType='secondary'
          fullWidth
          onClose={onClose}
          to='/skapa-konto'>
          Skapa konto
        </BaseButton>
      </Stack>
    </Stack>
  );
}
