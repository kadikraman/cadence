import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import ColorPicker from '../../components/ColorPicker';
import DatePickerSheet from '../../components/DatePickerSheet';
import GlyphPicker from '../../components/GlyphPicker';
import FormGroup from '../../components/ui/FormGroup';
import FormLabel from '../../components/ui/FormLabel';
import SegmentedControl from '../../components/ui/SegmentedControl';
import { getSymbol } from '../../utils/glyphs';
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
    dueDatePickerOpen,
    setDueDatePickerOpen,
    handlePickerSave,
    handlePickerClose,
    save,
    confirmDelete,
  } = useTaskForm();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  const tint = getTint(color);
  const tintBg = dark ? tint.tintDark : tint.tint;
  const tintAccent = dark ? tint.accentDark : tint.accent;

  if (!loaded) return <View style={styles.root} />;

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
            tintColor={tintAccent}
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
        onClose={handlePickerClose}
        onSave={handlePickerSave}
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
}));
