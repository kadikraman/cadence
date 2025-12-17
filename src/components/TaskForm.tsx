import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Cadence, Task } from '../lib/storage';
import { calculateNextDueDate } from '../utils/taskUtils';
import SegmentedPicker from './SegmentedPicker';

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const CADENCE_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Custom'];
const CADENCE_TYPES: ('daily' | 'weekly' | 'monthly' | 'custom')[] = [
  'daily',
  'weekly',
  'monthly',
  'custom',
];

const UNIT_OPTIONS = ['Days', 'Weeks', 'Months'];
const UNIT_TYPES: ('days' | 'weeks' | 'months')[] = ['days', 'weeks', 'months'];

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const { theme } = useUnistyles();
  const [title, setTitle] = useState('');
  const [cadenceType, setCadenceType] = useState<
    'daily' | 'weekly' | 'monthly' | 'custom'
  >('daily');
  const [customValue, setCustomValue] = useState('1');
  const [customUnit, setCustomUnit] = useState<'days' | 'weeks' | 'months'>(
    'days'
  );
  const [nextDueDate, setNextDueDate] = useState<Date>(new Date());
  const [details, setDetails] = useState('');

  const cadenceSelectedIndex = CADENCE_TYPES.indexOf(cadenceType);
  const unitSelectedIndex = UNIT_TYPES.indexOf(customUnit);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDetails(task.details || '');
      setCadenceType(task.cadence.type);
      if (task.cadence.type === 'custom') {
        setCustomValue(String(task.cadence.value || 1));
        setCustomUnit(task.cadence.unit || 'days');
      }
      if (task.nextDueDate) {
        setNextDueDate(new Date(task.nextDueDate));
      } else {
        const calculated = calculateNextDueDate(
          task.cadence,
          task.lastCompletedAt
        );
        setNextDueDate(new Date(calculated));
      }
    } else {
      setDetails('');
      const defaultDate = new Date();
      defaultDate.setHours(0, 0, 0, 0);
      setNextDueDate(defaultDate);
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim() || !nextDueDate) return;

    const cadence: Cadence =
      cadenceType === 'custom'
        ? {
            type: 'custom',
            value: parseInt(customValue, 10) || 1,
            unit: customUnit,
          }
        : { type: cadenceType };

    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    const newTask: Task = {
      id: task?.id || Date.now().toString(),
      title: title.trim(),
      cadence,
      createdAt: task?.createdAt || Date.now(),
      completedDates: task?.completedDates || [],
      lastCompletedAt: task?.lastCompletedAt,
      nextDueDate: dueDate.getTime(),
      details: details.trim() || undefined,
    };

    onSave(newTask);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {task ? 'Edit Task' : 'New Task'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={styles.content}
        bottomOffset={200}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={theme.colors.textTertiary}
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Details (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={details}
            onChangeText={setDetails}
            placeholder="Add any additional details or notes..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Cadence</Text>
          <SegmentedPicker
            options={CADENCE_OPTIONS}
            selectedIndex={cadenceSelectedIndex}
            onOptionSelected={(index: number) => {
              setCadenceType(CADENCE_TYPES[index]);
            }}
          />

          {cadenceType === 'custom' && (
            <View style={styles.customCadence}>
              <TextInput
                style={[styles.input, styles.customValueInput]}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textTertiary}
              />
              <SegmentedPicker
                style={{ width: Dimensions.get('window').width - 132 }}
                options={UNIT_OPTIONS}
                selectedIndex={unitSelectedIndex}
                onOptionSelected={(index: number) => {
                  setCustomUnit(UNIT_TYPES[index]);
                }}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Next Due Date</Text>
          <DateTimePicker
            style={{
              borderRadius: 24,
              paddingRight: 12,
            }}
            value={nextDueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type !== 'dismissed' && selectedDate) {
                setNextDueDate(selectedDate);
              }
            }}
            minimumDate={new Date()}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: theme.colors.text,
  },
  cancelButton: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    padding: 20,
    marginTop: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: -0.2,
    color: theme.colors.text,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
  customCadence: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customValueInput: {
    flex: 0,
    width: 80,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  dateButton: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
  },
  datePickerDone: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textArea: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 100,
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
    borderColor: theme.colors.border,
  },
}));
