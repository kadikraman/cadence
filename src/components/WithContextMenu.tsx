import { Button, ContextMenu, Host } from '@expo/ui/swift-ui';

export default function WithContextMenu({
  children,
  width,
  height,
  onEdit,
  onDelete,
  onViewHistory,
}: {
  children: React.ReactNode;
  width: number;
  height?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewHistory?: () => void;
}) {
  return (
    <Host style={{ width, height }}>
      <ContextMenu activationMethod="longPress">
        <ContextMenu.Items>
          {onEdit && (
            <Button systemImage="pencil" onPress={onEdit}>
              Edit
            </Button>
          )}
          {onViewHistory && (
            <Button
              systemImage="clock.arrow.circlepath"
              onPress={onViewHistory}
            >
              View History
            </Button>
          )}
          {onDelete && (
            <Button systemImage="trash" onPress={onDelete}>
              Delete
            </Button>
          )}
        </ContextMenu.Items>

        <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
