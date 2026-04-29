import { Modal, Stack, Select, Textarea, Button, Group } from '@mantine/core';

interface ReportModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  reasons: string[];
  reason: string | null;
  onReasonChange: (value: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export default function ReportModal({
  opened,
  onClose,
  title,
  reasons,
  reason,
  onReasonChange,
  description,
  onDescriptionChange,
}: ReportModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size='sm' centered>
      <Stack gap='md'>
        <Select
          label='Välj anledning'
          placeholder='Välj en anledning...'
          data={reasons}
          value={reason}
          onChange={onReasonChange}
          required
        />
        <Textarea
          name='description'
          label='Beskrivning (max 400 tecken)'
          placeholder='Beskriv anledningen till rapporteringen så tydligt du kan.'
          autosize
          minRows={3}
          maxRows={5}
          maxLength={400}
          value={description}
          onChange={(e) => onDescriptionChange(e.currentTarget.value)}
        />
        <Group justify='flex-end'>
          <Button variant='light' onClick={onClose}>
            Avbryt
          </Button>
          <Button disabled={!reason} onClick={onClose}>
            Skicka rapport
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
