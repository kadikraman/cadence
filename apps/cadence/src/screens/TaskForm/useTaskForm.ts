import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { logs } from '../../lib/logs';
import { Cadence, Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';
import { GlyphKey } from '../../utils/glyphs';
import { ColorKey } from '../../utils/taskTints';
import { calculateNextDueDate, getTodayTimestamp } from '../../utils/taskUtils';
import { CadenceType, CadenceUnit } from './helpers';

interface FormParams {
  taskId?: string;
  title?: string;
  cadenceType?: CadenceType;
  cadenceValue?: string;
  cadenceUnit?: CadenceUnit;
  color?: ColorKey;
  glyph?: GlyphKey;
}

export function useTaskForm() {
  const router = useRouter();
  const params = useLocalSearchParams() as Partial<FormParams>;
  const isEdit = !!params.taskId;

  const saveTask = useTasksStore(s => s.save);
  const removeTask = useTasksStore(s => s.remove);
  const existing = useTasksStore(s =>
    params.taskId ? (s.tasks.find(t => t.id === params.taskId) ?? null) : null
  );

  const [title, setTitle] = useState(
    () => existing?.title ?? params.title ?? ''
  );
  const [details, setDetails] = useState(() => existing?.details ?? '');
  const [color, setColor] = useState<ColorKey>(
    () => existing?.color ?? params.color ?? 'slate'
  );
  const [glyph, setGlyph] = useState<GlyphKey>(
    () => existing?.glyph ?? params.glyph ?? 'entry'
  );
  const [cadenceType, setCadenceType] = useState<CadenceType>(
    () => existing?.cadence.type ?? params.cadenceType ?? 'weekly'
  );
  const [customValue, setCustomValue] = useState(() =>
    existing?.cadence.type === 'custom'
      ? String(existing.cadence.value ?? 2)
      : (params.cadenceValue ?? '2')
  );
  const [customUnit, setCustomUnit] = useState<CadenceUnit>(() =>
    existing?.cadence.type === 'custom'
      ? (existing.cadence.unit ?? 'weeks')
      : (params.cadenceUnit ?? 'weeks')
  );
  const initialNextDue = useMemo(
    () =>
      existing
        ? (existing.nextDueDate ??
          calculateNextDueDate(existing.cadence, existing.lastCompletedAt))
        : getTodayTimestamp(),
    [existing]
  );
  const [nextDueDate, setNextDueDate] = useState<number>(initialNextDue);
  const [dueDatePickerOpen, setDueDatePickerOpen] = useState(false);
  const loaded = !isEdit || !!existing;
  const canSave = title.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    const cadence: Cadence =
      cadenceType === 'custom'
        ? {
            type: 'custom',
            value: Math.max(1, parseInt(customValue, 10) || 1),
            unit: customUnit,
          }
        : { type: cadenceType };

    const saved: Task = {
      id: existing?.id ?? `t_${Date.now()}`,
      title: title.trim(),
      details: details.trim() || undefined,
      color,
      glyph,
      cadence,
      createdAt: existing?.createdAt ?? Date.now(),
      completedDates: existing?.completedDates ?? [],
      lastCompletedAt: existing?.lastCompletedAt,
      nextDueDate,
    };
    await saveTask(saved);
    if (!existing) logs.taskCreated(!!params.title);
    router.back();
  };

  const confirmDelete = () => {
    if (!existing) return;
    Alert.alert(
      'Delete task',
      `"${existing.title}" and its history will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            logs.taskDeleted();
            await removeTask(existing.id);
            router.back();
          },
        },
      ]
    );
  };

  return {
    router,
    isEdit,
    loaded,
    canSave,
    title,
    setTitle,
    details,
    setDetails,
    color,
    setColor,
    glyph,
    setGlyph,
    cadenceType,
    setCadenceType,
    customValue,
    setCustomValue,
    customUnit,
    setCustomUnit,
    nextDueDate,
    setNextDueDate,
    dueDatePickerOpen,
    setDueDatePickerOpen,
    save,
    confirmDelete,
    existing,
  };
}
