import BaseButton from '../BaseButton/BaseButton';
import './LoginButtons.scss';

export default function LoginButtons() {
  return (
    <div className='loginButtons-wrapper'>
      <BaseButton variantType='primary' fullWidth={true}>
        Logga in
      </BaseButton>
      <BaseButton variantType='secondary' fullWidth={true}>
        Skapa konto
      </BaseButton>
    </div>
  );
}
