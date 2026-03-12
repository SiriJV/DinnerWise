import { TextInput } from '@mantine/core';
import { Link } from 'lucide-react';
import { useState } from 'react';

interface ShareLinkProps {
  eventUrl: string;
  generatedUrl: string;
}

export default function ShareLink({ eventUrl, generatedUrl }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <TextInput
      label='Kopiera länk'
      value={copied ? 'Kopierad!' : generatedUrl}
      variant='filled'
      readOnly
      radius='xs'
      leftSection={
        <div
          onClick={handleShareLink}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}>
          <Link size={18} />
        </div>
      }
      onClick={handleShareLink}
      styles={{
        input: {
          backgroundColor: 'var(--mantine-color-gray-0)',
          cursor: 'pointer',
          minHeight: '50px',
          paddingBlock: 'var(--mantine-spacing-md)',
        },
      }}
    />
  );
}
