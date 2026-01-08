import BaseButton from '../BaseButton/BaseButton';
import './LoginButtons.scss';

type LoginButtonsProps = {
  onClose: () => void;
};

export default function LoginButtons({ onClose }: LoginButtonsProps) {
  return (
    <div className='loginButtons-wrapper'>
      <p className='loginButtons-welcome'>Välkommen till DinnerWise</p>
      <div className='buttons-wrapper'>
        <BaseButton
          variantType='primary'
          fullWidth
          to='/logga-in'
          onClose={onClose}>
          Logga in
        </BaseButton>
        <BaseButton
          variantType='secondary'
          fullWidth
          to='/skapa-konto'
          onClose={onClose}>
          Skapa konto
        </BaseButton>
      </div>
    </div>
  );
}
