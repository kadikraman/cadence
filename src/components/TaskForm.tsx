import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CadenceType, TaskFormData } from '../utils/taskUtils';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskFormData) => Promise<void>;
  initialData?: Partial<TaskFormData>;
  title?: string;
}

const CADENCE_OPTIONS: {
  type: CadenceType;
  label: string;
  intervals: number[];
}[] = [
  { type: 'daily', label: 'Daily', intervals: [1, 2, 3, 4, 5, 6, 7] },
  { type: 'weekly', label: 'Weekly', intervals: [1, 2, 3, 4] },
  { type: 'monthly', label: 'Monthly', intervals: [1, 2, 3, 6] },
  { type: 'yearly', label: 'Yearly', intervals: [1, 2, 3, 5] },
];

export default function TaskForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  title = 'Create Task',
}: TaskFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [cadenceType, setCadenceType] = useState<CadenceType>(
    initialData?.cadenceType || 'daily'
  );
  const [cadenceInterval, setCadenceInterval] = useState(
    initialData?.cadenceInterval || 1
  );
  const [nextDueDate, setNextDueDate] = useState<Date>(
    initialData?.nextDueDate || new Date()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setCadenceType(initialData.cadenceType || 'daily');
      setCadenceInterval(initialData.cadenceInterval || 1);
      setNextDueDate(initialData.nextDueDate || new Date());
    } else {
      setName('');
      setDescription('');
      setCadenceType('daily');
      setCadenceInterval(1);
      setNextDueDate(new Date());
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        cadenceType,
        cadenceInterval,
        nextDueDate,
      });
      handleClose();
    } catch {
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setCadenceType('daily');
    setCadenceInterval(1);
    setNextDueDate(new Date());
    onClose();
  };

  const getIntervalLabel = (type: CadenceType, interval: number): string => {
    const getSingularForm = (cadenceType: CadenceType): string => {
      switch (cadenceType) {
        case 'daily':
          return 'day';
        case 'weekly':
          return 'week';
        case 'monthly':
          return 'month';
        case 'yearly':
          return 'year';
        default:
          return (cadenceType as string).slice(0, -2);
      }
    };

    const singular = getSingularForm(type);

    if (interval === 1) {
      return `Every ${singular}`;
    }
    return `Every ${interval} ${singular}s`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
            <Text
              style={[styles.saveButton, isSubmitting && styles.disabledButton]}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Task Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter task name"
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cadence</Text>
            {CADENCE_OPTIONS.map(option => (
              <View key={option.type} style={styles.cadenceGroup}>
                <TouchableOpacity
                  style={[
                    styles.cadenceTypeButton,
                    cadenceType === option.type && styles.selectedCadenceType,
                  ]}
                  onPress={() => {
                    setCadenceType(option.type);
                    setCadenceInterval(1);
                  }}
                >
                  <Text
                    style={[
                      styles.cadenceTypeText,
                      cadenceType === option.type &&
                        styles.selectedCadenceTypeText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>

                {cadenceType === option.type && (
                  <View style={styles.intervalContainer}>
                    {option.intervals.map(interval => (
                      <TouchableOpacity
                        key={interval}
                        style={[
                          styles.intervalButton,
                          cadenceInterval === interval &&
                            styles.selectedInterval,
                        ]}
                        onPress={() => setCadenceInterval(interval)}
                      >
                        <Text
                          style={[
                            styles.intervalText,
                            cadenceInterval === interval &&
                              styles.selectedIntervalText,
                          ]}
                        >
                          {getIntervalLabel(option.type, interval)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Next Due Date</Text>
            <View style={styles.dateOptions}>
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  nextDueDate.toDateString() === new Date().toDateString() &&
                    styles.selectedDateOption,
                ]}
                onPress={() => setNextDueDate(new Date())}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    nextDueDate.toDateString() === new Date().toDateString() &&
                      styles.selectedDateOptionText,
                  ]}
                >
                  Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  nextDueDate.toDateString() !== new Date().toDateString() &&
                    styles.selectedDateOption,
                ]}
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setNextDueDate(tomorrow);
                }}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    nextDueDate.toDateString() !== new Date().toDateString() &&
                      styles.selectedDateOptionText,
                  ]}
                >
                  Next Interval
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.datePreview}>
              Due: {nextDueDate.toLocaleDateString()}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  cadenceGroup: {
    marginBottom: 12,
  },
  cadenceTypeButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedCadenceType: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  cadenceTypeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCadenceTypeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  intervalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalButton: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedInterval: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  intervalText: {
    fontSize: 14,
    color: '#666',
  },
  selectedIntervalText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dateOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  dateOption: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedDateOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  dateOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDateOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  datePreview: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
