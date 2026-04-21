import { SymbolView } from 'expo-symbols';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import ColorPicker from '../../components/ColorPicker';
import DatePickerSheet, { QuickOption } from '../../components/DatePickerSheet';
import GlyphPicker from '../../components/GlyphPicker';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { Cadence, Task, taskStorage } from '../../lib/storage';
import { GlyphKey, getSymbol } from '../../utils/glyphs';
import { ColorKey, getTint } from '../../utils/taskTints';
import {
  calculateNextDueDate,
  getTodayTimestamp,
  normalizeToMidnight,
} from '../../utils/taskUtils';

type CadenceType = Cadence['type'];
type CadenceUnit = NonNullable<Cadence['unit']>;

const CADENCE_OPTIONS: { value: CadenceType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

const UNIT_OPTIONS: { value: CadenceUnit; label: string }[] = [
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
  { value: 'months', label: 'months' },
];

const MS_DAY = 86400000;

const getDueQuickOptions = (): QuickOption[] => {
  const today = getTodayTimestamp();
  return [
    { label: 'Yesterday', ts: today - MS_DAY },
    { label: 'Today', ts: today },
    { label: 'Tomorrow', ts: today + MS_DAY },
    { label: 'Next week', ts: today + 7 * MS_DAY },
  ];
};

const formatDueDate = (ts: number): string => {
  const today = getTodayTimestamp();
  const diffDays = Math.round((normalizeToMidnight(ts) - today) / MS_DAY);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  return new Date(ts).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export default function TaskFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    taskId?: string;
    title?: string;
    cadenceType?: CadenceType;
    cadenceValue?: string;
    cadenceUnit?: CadenceUnit;
    color?: ColorKey;
    glyph?: GlyphKey;
  }>();
  const isEdit = !!params.taskId;
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';

  const [existing, setExisting] = useState<Task | null>(null);
  const [loaded, setLoaded] = useState(!isEdit);
  const [title, setTitle] = useState(() => params.title ?? '');
  const [details, setDetails] = useState('');
  const [color, setColor] = useState<ColorKey>(() => params.color ?? 'blue');
  const [glyph, setGlyph] = useState<GlyphKey>(() => params.glyph ?? 'entry');
  const [cadenceType, setCadenceType] = useState<CadenceType>(
    () => params.cadenceType ?? 'weekly'
  );
  const [customValue, setCustomValue] = useState(
    () => params.cadenceValue ?? '2'
  );
  const [customUnit, setCustomUnit] = useState<CadenceUnit>(
    () => params.cadenceUnit ?? 'weeks'
  );
  const [nextDueDate, setNextDueDate] = useState<number>(() =>
    getTodayTimestamp()
  );
  const [dueDatePickerOpen, setDueDatePickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!params.taskId) return;
      (async () => {
        const t = await taskStorage.getTask(params.taskId!);
        if (t) {
          setExisting(t);
          setTitle(t.title);
          setDetails(t.details ?? '');
          setColor(t.color ?? 'blue');
          setGlyph(t.glyph ?? 'entry');
          setCadenceType(t.cadence.type);
          if (t.cadence.type === 'custom') {
            setCustomValue(String(t.cadence.value ?? 2));
            setCustomUnit(t.cadence.unit ?? 'weeks');
          }
          setNextDueDate(
            t.nextDueDate ?? calculateNextDueDate(t.cadence, t.lastCompletedAt)
          );
        }
        setLoaded(true);
      })();
    }, [params.taskId])
  );

  const tint = getTint(color);
  const tintBg = dark ? tint.tintDark : tint.tint;

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
    await taskStorage.saveTask(saved);
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
            await taskStorage.deleteTask(existing.id);
            router.back();
          },
        },
      ]
    );
  };

  if (!loaded) return <View style={styles.root} />;

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>{isEdit ? 'Edit Task' : 'New Task'}</Text>
        <Pressable onPress={save} disabled={!canSave}>
          <Text
            style={[
              styles.save,
              { color: canSave ? theme.colors.blue : theme.colors.label4 },
            ]}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <View style={[styles.preview, { backgroundColor: tintBg }]}>
          <SymbolView
            name={getSymbol(glyph)}
            size={38}
            tintColor={tint.accent}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
        </View>

        <FormGroup>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task name"
            placeholderTextColor={theme.colors.label3}
            style={styles.titleInput}
          />
          <View style={styles.sepInset} />
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Notes (optional)"
            placeholderTextColor={theme.colors.label3}
            multiline
            style={styles.detailsInput}
          />
        </FormGroup>

        <FormLabel>Repeats</FormLabel>
        <FormGroup>
          <View style={styles.cadenceBlock}>
            <SegmentedControl
              value={cadenceType}
              onChange={setCadenceType}
              options={CADENCE_OPTIONS}
            />
            {cadenceType === 'custom' && (
              <View style={styles.customRow}>
                <Text style={styles.customLabel}>Every</Text>
                <TextInput
                  value={customValue}
                  onChangeText={v => setCustomValue(v.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  style={styles.customInput}
                  maxLength={3}
                />
                <View style={styles.customUnits}>
                  <SegmentedControl
                    value={customUnit}
                    onChange={setCustomUnit}
                    options={UNIT_OPTIONS}
                  />
                </View>
              </View>
            )}
          </View>
        </FormGroup>

        <FormLabel>Next Due</FormLabel>
        <FormGroup>
          <Pressable
            onPress={() => setDueDatePickerOpen(true)}
            style={styles.dueRow}
          >
            <Text style={styles.dueLabel}>Due</Text>
            <View style={styles.dueValueWrap}>
              <Text style={styles.dueValue}>{formatDueDate(nextDueDate)}</Text>
              <SymbolView
                name="chevron.right"
                size={12}
                tintColor={theme.colors.label3}
                resizeMode="scaleAspectFit"
                fallback={null}
              />
            </View>
          </Pressable>
        </FormGroup>

        <FormLabel>Color</FormLabel>
        <FormGroup>
          <ColorPicker value={color} onChange={setColor} />
        </FormGroup>

        <FormLabel>Icon</FormLabel>
        <FormGroup>
          <GlyphPicker value={glyph} color={color} onChange={setGlyph} />
        </FormGroup>

        {isEdit && (
          <View style={styles.deleteWrap}>
            <Pressable onPress={confirmDelete} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete Task</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollView>

      <DatePickerSheet
        visible={dueDatePickerOpen}
        initialDate={nextDueDate}
        title="Next due"
        selectedLabel="Due"
        quickOptions={getDueQuickOptions()}
        allowFuture
        onClose={() => setDueDatePickerOpen(false)}
        onSave={ts => {
          setNextDueDate(ts);
          setDueDatePickerOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.sepSubtle,
  },
  cancel: {
    color: theme.colors.blue,
    fontSize: 17,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  save: {
    fontSize: 17,
    fontWeight: '600',
  },
  scroll: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  preview: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titleInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    letterSpacing: -0.4,
    color: theme.colors.text,
  },
  detailsInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    letterSpacing: -0.2,
    color: theme.colors.text,
    minHeight: 44,
  },
  sepInset: {
    height: 0.5,
    backgroundColor: theme.colors.sepSubtle,
    marginLeft: 16,
  },
  cadenceBlock: {
    padding: 10,
    gap: 10,
  },
  customRow: {
    padding: 10,
    backgroundColor: theme.colors.fill4,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customLabel: {
    fontSize: 15,
    color: theme.colors.label2,
  },
  customInput: {
    width: 52,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 7,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  customUnits: {
    flex: 1,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dueLabel: {
    fontSize: 17,
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  dueValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueValue: {
    fontSize: 17,
    color: theme.colors.label2,
    letterSpacing: -0.4,
  },
  deleteWrap: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  deleteBtn: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: theme.colors.error,
    fontSize: 17,
  },
}));
