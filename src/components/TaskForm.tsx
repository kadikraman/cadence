import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Cadence, Task } from '../lib/storage';
import { useTheme } from '../contexts/ThemeContext';
import { calculateNextDueDate } from '../utils/taskUtils';

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const { theme } = useTheme();
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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.cancelButton, { color: theme.textSecondary }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {task ? 'Edit Task' : 'New Task'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: theme.text }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Task Title</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={theme.textTertiary}
            autoFocus
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>
            Details (Optional)
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            value={details}
            onChangeText={setDetails}
            placeholder="Add any additional details or notes..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Cadence</Text>
          <View style={styles.cadenceOptions}>
            {(['daily', 'weekly', 'monthly'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.cadenceButton,
                  {
                    backgroundColor:
                      cadenceType === type
                        ? theme.primary
                        : theme.buttonInactive,
                    borderColor:
                      cadenceType === type ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setCadenceType(type)}
              >
                <Text
                  style={[
                    styles.cadenceButtonText,
                    {
                      color:
                        cadenceType === type
                          ? theme.primaryText
                          : theme.buttonInactiveText,
                    },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.cadenceButton,
                {
                  backgroundColor:
                    cadenceType === 'custom'
                      ? theme.primary
                      : theme.buttonInactive,
                  borderColor:
                    cadenceType === 'custom' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setCadenceType('custom')}
            >
              <Text
                style={[
                  styles.cadenceButtonText,
                  {
                    color:
                      cadenceType === 'custom'
                        ? theme.primaryText
                        : theme.buttonInactiveText,
                  },
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>

          {cadenceType === 'custom' && (
            <View style={styles.customCadence}>
              <TextInput
                style={[
                  styles.input,
                  styles.customValueInput,
                  {
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor={theme.textTertiary}
              />
              <View style={styles.unitButtons}>
                {(['days', 'weeks', 'months'] as const).map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitButton,
                      {
                        backgroundColor:
                          customUnit === unit
                            ? theme.primary
                            : theme.buttonInactive,
                        borderColor:
                          customUnit === unit ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setCustomUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        {
                          color:
                            customUnit === unit
                              ? theme.primaryText
                              : theme.buttonInactiveText,
                        },
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Next Due Date</Text>
          <DateTimePicker
            style={{
              backgroundColor: theme.primary,
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  cadenceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cadenceButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  cadenceButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
  },
});
