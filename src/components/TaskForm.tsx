import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, Cadence } from '../lib/storage';
import { calculateNextDueDate } from '../utils/taskUtils';

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [cadenceType, setCadenceType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customValue, setCustomValue] = useState('1');
  const [customUnit, setCustomUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCadenceType(task.cadence.type);
      if (task.cadence.type === 'custom') {
        setCustomValue(String(task.cadence.value || 1));
        setCustomUnit(task.cadence.unit || 'days');
      }
      if (task.nextDueDate) {
        setNextDueDate(new Date(task.nextDueDate));
      } else {
        const calculated = calculateNextDueDate(task.cadence, task.lastCompletedAt);
        setNextDueDate(new Date(calculated));
      }
    } else {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 1);
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
    <SafeAreaView style={styles.container}>
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

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor="#999"
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Cadence</Text>
          <View style={styles.cadenceOptions}>
            {(['daily', 'weekly', 'monthly'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.cadenceButton,
                  cadenceType === type && styles.cadenceButtonActive,
                ]}
                onPress={() => setCadenceType(type)}
              >
                <Text
                  style={[
                    styles.cadenceButtonText,
                    cadenceType === type && styles.cadenceButtonTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.cadenceButton,
                cadenceType === 'custom' && styles.cadenceButtonActive,
              ]}
              onPress={() => setCadenceType('custom')}
            >
              <Text
                style={[
                  styles.cadenceButtonText,
                  cadenceType === 'custom' && styles.cadenceButtonTextActive,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>

          {cadenceType === 'custom' && (
            <View style={styles.customCadence}>
              <TextInput
                style={[styles.input, styles.customValueInput]}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <View style={styles.unitButtons}>
                {(['days', 'weeks', 'months'] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitButton,
                      customUnit === unit && styles.unitButtonActive,
                    ]}
                    onPress={() => setCustomUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        customUnit === unit && styles.unitButtonTextActive,
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

        <View style={styles.section}>
          <Text style={styles.label}>Next Due Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {nextDueDate ? formatDate(nextDueDate) : 'Select date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && nextDueDate && (
            <DateTimePicker
              value={nextDueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (event.type !== 'dismissed' && selectedDate) {
                  setNextDueDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity
              style={styles.datePickerDone}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerDoneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    letterSpacing: -0.3,
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  input: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cadenceButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  cadenceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  cadenceButtonTextActive: {
    color: '#fff',
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
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  dateButton: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerDone: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerDoneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

