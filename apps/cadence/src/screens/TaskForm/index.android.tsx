import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorPicker from '../../components/ColorPicker';
import DatePickerSheet from '../../components/DatePickerSheet';
import GlyphPicker from '../../components/GlyphPicker';
import Chip from '../../components/ui/android/Chip';
import MaterialButton from '../../components/ui/android/MaterialButton';
import MaterialTextField from '../../components/ui/android/MaterialTextField';
import TopAppBar from '../../components/ui/android/TopAppBar';
import { getMaterialIcon, getSymbol } from '../../utils/glyphs';
import { getTint } from '../../utils/taskTints';
import {
  CADENCE_OPTIONS,
  UNIT_OPTIONS,
  formatDueDate,
  getDueQuickOptions,
} from './helpers';
import { useTaskForm } from './useTaskForm';

export default function TaskFormScreen() {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  const {
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
  } = useTaskForm();

  const tint = getTint(color);
  const tintBg = dark ? tint.tintDark : tint.tint;

  if (!loaded) return <View style={styles.root} />;

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
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <View style={styles.previewWrap}>
          <View style={[styles.preview, { backgroundColor: tintBg }]}>
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

        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
          Repeats
        </Text>
        <View style={styles.chipRow}>
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
              styles.customRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text style={[styles.customLabel, { color: theme.colors.label2 }]}>
              Every
            </Text>
            <TextInput
              value={customValue}
              onChangeText={v => setCustomValue(v.replace(/[^0-9]/g, '') || '')}
              keyboardType="number-pad"
              maxLength={3}
              style={[
                styles.customInput,
                {
                  color: theme.colors.text,
                  borderColor: theme.colors.outline,
                },
              ]}
            />
            <View style={styles.customUnits}>
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

        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
          Next due
        </Text>
        <Pressable
          onPress={() => setDueDatePickerOpen(true)}
          android_ripple={{ color: theme.colors.fill2, borderless: false }}
          style={[
            styles.dueRow,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <Text style={[styles.dueLabel, { color: theme.colors.text }]}>
            Due
          </Text>
          <Text style={[styles.dueValue, { color: theme.colors.label2 }]}>
            {formatDueDate(nextDueDate)}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.label3}
          />
        </Pressable>

        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
          Color
        </Text>
        <ColorPicker value={color} onChange={setColor} />

        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
          Icon
        </Text>
        <GlyphPicker value={glyph} color={color} onChange={setGlyph} />

        {isEdit && (
          <View style={styles.deleteWrap}>
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

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  previewWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    paddingTop: 24,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  customRow: {
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
  customLabel: {
    fontSize: 14,
  },
  customInput: {
    width: 60,
    textAlign: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  customUnits: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  dueLabel: {
    flex: 1,
    fontSize: 16,
  },
  dueValue: {
    fontSize: 15,
  },
  deleteWrap: {
    marginTop: 32,
    alignItems: 'center',
  },
}));
