import { Host } from '@expo/ui';
import { Button, ConfirmationDialog } from '@expo/ui/swift-ui';
import { buttonStyle, font } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';

interface ClearDoneButtonProps {
  count: number;
  onConfirm: () => void;
}

export default function ClearDoneButton({
  count,
  onConfirm,
}: ClearDoneButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Host matchContents>
      <ConfirmationDialog
        title={`Delete ${count} done to-do${count === 1 ? '' : 's'}?`}
        titleVisibility="visible"
        isPresented={open}
        onIsPresentedChange={setOpen}
      >
        <ConfirmationDialog.Trigger>
          <Button
            label="Clear done"
            onPress={() => setOpen(true)}
            modifiers={[buttonStyle('borderless'), font({ size: 15 })]}
          />
        </ConfirmationDialog.Trigger>
        <ConfirmationDialog.Actions>
          <Button label="Clear done" role="destructive" onPress={onConfirm} />
        </ConfirmationDialog.Actions>
      </ConfirmationDialog>
    </Host>
  );
}
