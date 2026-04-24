import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorPicker from '../../components/ColorPicker';
import DatePickerSheet, { QuickOption } from '../../components/DatePickerSheet';
import GlyphPicker from '../../components/GlyphPicker';
import Chip from '../../components/ui/android/Chip';
import MaterialButton from '../../components/ui/android/MaterialButton';
import MaterialTextField from '../../components/ui/android/MaterialTextField';
import TopAppBar from '../../components/ui/android/TopAppBar';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { Cadence, Task } from '../../lib/types';
import { useTasksStore } from '../../stores/tasks';
import { getMaterialIcon, getSymbol, GlyphKey } from '../../utils/glyphs';
import { ColorKey, getTint } from '../../utils/taskTints';
import {
  calculateNextDueDate,
  getTodayTimestamp,
  normalizeToMidnight,
} from '../../utils/taskUtils';

type CadenceType = Cadence['type'];
type CadenceUnit = NonNullable<Cadence['unit']>;

const IS_ANDROID = Platform.OS === 'android';

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
    await saveTask(saved);
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
            await removeTask(existing.id);
            router.back();
          },
        },
      ]
    );
  };

  if (!loaded) return <View style={styles.root} />;

  if (IS_ANDROID) {
    return (
      <View style={[styles.root, { paddingTop: rt.insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <TopAppBar
          title={isEdit ? 'Edit task' : 'New task'}
          variant="small"
          backIcon="close"
          backLabel="Cancel"
          onBack={() => router.back()}
          right={
            <MaterialButton
              onPress={save}
              disabled={!canSave}
              variant={canSave ? 'filled' : 'outlined'}
              accessibilityLabel="Save task"
            >
              Save
            </MaterialButton>
          }
        />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.androidScroll}
          keyboardShouldPersistTaps="handled"
          bottomOffset={20}
        >
          <View style={styles.androidPreviewWrap}>
            <View style={[styles.androidPreview, { backgroundColor: tintBg }]}>
              <SymbolView
                name={getSymbol(glyph)}
                size={48}
                tintColor={tint.accent}
                resizeMode="scaleAspectFit"
                fallback={
                  <MaterialCommunityIcons
                    name={getMaterialIcon(glyph)}
                    size={48}
                    color={tint.accent}
                  />
                }
              />
            </View>
          </View>

          <MaterialTextField
            label="Task name"
            value={title}
            onChangeText={setTitle}
          />
          <View style={{ height: 14 }} />
          <MaterialTextField
            label="Notes (optional)"
            value={details}
            onChangeText={setDetails}
            multiline
          />

          <Text
            style={[styles.androidSectionLabel, { color: theme.colors.text }]}
          >
            Repeats
          </Text>
          <View style={styles.androidChipRow}>
            {CADENCE_OPTIONS.map(o => (
              <Chip
                key={o.value}
                label={o.label}
                selected={cadenceType === o.value}
                onPress={() => setCadenceType(o.value)}
              />
            ))}
          </View>
          {cadenceType === 'custom' && (
            <View
              style={[
                styles.androidCustomRow,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <Text
                style={[
                  styles.androidCustomLabel,
                  { color: theme.colors.label2 },
                ]}
              >
                Every
              </Text>
              <TextInput
                value={customValue}
                onChangeText={v =>
                  setCustomValue(v.replace(/[^0-9]/g, '') || '')
                }
                keyboardType="number-pad"
                maxLength={3}
                style={[
                  styles.androidCustomInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.outline,
                  },
                ]}
              />
              <View style={styles.androidCustomUnits}>
                {UNIT_OPTIONS.map(u => (
                  <Chip
                    key={u.value}
                    label={u.label}
                    selected={customUnit === u.value}
                    onPress={() => setCustomUnit(u.value)}
                  />
                ))}
              </View>
            </View>
          )}

          <Text
            style={[styles.androidSectionLabel, { color: theme.colors.text }]}
          >
            Next due
          </Text>
          <Pressable
            onPress={() => setDueDatePickerOpen(true)}
            android_ripple={{ color: theme.colors.fill2, borderless: false }}
            style={[
              styles.androidDueRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text
              style={[styles.androidDueLabel, { color: theme.colors.text }]}
            >
              Due
            </Text>
            <Text
              style={[styles.androidDueValue, { color: theme.colors.label2 }]}
            >
              {formatDueDate(nextDueDate)}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={theme.colors.label3}
            />
          </Pressable>

          <Text
            style={[styles.androidSectionLabel, { color: theme.colors.text }]}
          >
            Color
          </Text>
          <ColorPicker value={color} onChange={setColor} />

          <Text
            style={[styles.androidSectionLabel, { color: theme.colors.text }]}
          >
            Icon
          </Text>
          <GlyphPicker value={glyph} color={color} onChange={setGlyph} />

          {isEdit && (
            <View style={styles.androidDeleteWrap}>
              <MaterialButton
                onPress={confirmDelete}
                variant="outlined"
                accessibilityLabel="Delete task"
              >
                Delete task
              </MaterialButton>
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

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: isEdit ? 'Edit Task' : 'New Task',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Text style={{ color: theme.colors.blue, fontSize: 17 }}>
                Cancel
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={save} disabled={!canSave} hitSlop={10}>
              <Text
                style={{
                  color: canSave ? theme.colors.blue : theme.colors.label4,
                  fontSize: 17,
                  fontWeight: '600',
                }}
              >
                Save
              </Text>
            </Pressable>
          ),
        }}
      />

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
  androidScroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  androidPreviewWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  androidPreview: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidSectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    paddingTop: 24,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  androidChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  androidCustomRow: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  androidCustomLabel: {
    fontSize: 14,
  },
  androidCustomInput: {
    width: 60,
    textAlign: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  androidCustomUnits: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  androidDueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  androidDueLabel: {
    flex: 1,
    fontSize: 16,
  },
  androidDueValue: {
    fontSize: 15,
  },
  androidDeleteWrap: {
    marginTop: 32,
    alignItems: 'center',
  },
}));
