import BaseButton from '../components/Buttons/BaseButton/BaseButton';

export default function HomePage(): React.ReactNode {
  return (
    <>
      <div>
        Home Page
        <BaseButton>Primär</BaseButton>
      </div>

      <BaseButton variantType='secondary'>Sekundär</BaseButton>

      <BaseButton variantType='danger'>Ta bort</BaseButton>

      <BaseButton variantType='ghost'>Läs mer</BaseButton>

      <BaseButton size='sm'>Liten</BaseButton>
      <BaseButton>Default</BaseButton>
      <BaseButton size='lg'>Stor</BaseButton>

      <BaseButton variantType='secondary' size='lg'>
        Sekundär stor
      </BaseButton>

      <BaseButton variantType='primary' fullWidth>
        Full width
      </BaseButton>

      <BaseButton variantType='danger' size='md' fullWidth>
        Full width Danger
      </BaseButton>
    </>
  );
}
