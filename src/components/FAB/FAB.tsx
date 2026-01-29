import { Button } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FloatingActionButtonProps = {
  to: string;
};

export default function FloatingActionButton({ to }: FloatingActionButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <Button onClick={handleClick} radius="xl" size="lg"
      style={{ position: 'fixed', bottom: 20, right: 20, borderRadius: '50%', padding: 0, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, }} aria-label="Skapa">
        <Plus size={28} />
    </Button>
  );
}