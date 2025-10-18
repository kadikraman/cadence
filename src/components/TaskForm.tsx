import { SFSymbol, SymbolView } from 'expo-symbols';
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
import {
  CadenceType,
  TaskFormData,
  calculateNextDueDate,
} from '../utils/taskUtils';

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
  icon: string;
  intervals: number[];
}[] = [
  {
    type: 'daily',
    label: 'Daily',
    icon: 'sun.max',
    intervals: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    type: 'weekly',
    label: 'Weekly',
    icon: 'calendar',
    intervals: [1, 2, 3, 4],
  },
  {
    type: 'monthly',
    label: 'Monthly',
    icon: 'calendar.badge.clock',
    intervals: [1, 2, 3, 6],
  },
  {
    type: 'yearly',
    label: 'Yearly',
    icon: 'calendar.badge.plus',
    intervals: [1, 2, 3, 5],
  },
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
            <View style={styles.saveButtonContainer}>
              {isSubmitting ? (
                <SymbolView
                  name="clock"
                  style={styles.saveButtonIcon}
                  tintColor="#007AFF"
                  type="hierarchical"
                />
              ) : (
                <SymbolView
                  name="checkmark"
                  style={styles.saveButtonIcon}
                  tintColor="#007AFF"
                  type="hierarchical"
                />
              )}
              <Text
                style={[
                  styles.saveButton,
                  isSubmitting && styles.disabledButton,
                ]}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <SymbolView
                name="textformat"
                style={styles.labelIcon}
                tintColor="#007AFF"
                type="hierarchical"
              />
              <Text style={styles.label}>Task Name *</Text>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter task name"
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <SymbolView
                name="doc.text"
                style={styles.labelIcon}
                tintColor="#007AFF"
                type="hierarchical"
              />
              <Text style={styles.label}>Description</Text>
            </View>
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
            <View style={styles.labelContainer}>
              <SymbolView
                name="repeat"
                style={styles.labelIcon}
                tintColor="#007AFF"
                type="hierarchical"
              />
              <Text style={styles.label}>Cadence</Text>
            </View>
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
                  <SymbolView
                    name={option.icon as SFSymbol}
                    style={styles.cadenceTypeIcon}
                    tintColor={
                      cadenceType === option.type ? '#007AFF' : '#8E8E93'
                    }
                    type="hierarchical"
                  />
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
            <View style={styles.labelContainer}>
              <SymbolView
                name="calendar"
                style={styles.labelIcon}
                tintColor="#007AFF"
                type="hierarchical"
              />
              <Text style={styles.label}>Next Due Date</Text>
            </View>
            <View style={styles.dateOptions}>
              <TouchableOpacity
                style={[
                  styles.dateOption,
                  nextDueDate.toDateString() === new Date().toDateString() &&
                    styles.selectedDateOption,
                ]}
                onPress={() => setNextDueDate(new Date())}
              >
                <SymbolView
                  name="clock"
                  style={styles.dateOptionIcon}
                  tintColor={
                    nextDueDate.toDateString() === new Date().toDateString()
                      ? '#007AFF'
                      : '#8E8E93'
                  }
                  type="hierarchical"
                />
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
                  const nextIntervalDate = calculateNextDueDate(
                    new Date(),
                    cadenceType,
                    cadenceInterval
                  );
                  setNextDueDate(nextIntervalDate);
                }}
              >
                <SymbolView
                  name="arrow.right"
                  style={styles.dateOptionIcon}
                  tintColor={
                    nextDueDate.toDateString() !== new Date().toDateString()
                      ? '#007AFF'
                      : '#8E8E93'
                  }
                  type="hierarchical"
                />
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
            <View style={styles.datePreviewContainer}>
              <SymbolView
                name="calendar.badge.clock"
                style={styles.datePreviewIcon}
                tintColor="#8E8E93"
                type="hierarchical"
              />
              <Text style={styles.datePreview}>
                Due: {nextDueDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  cancelButton: {
    fontSize: 17,
    color: '#FF3B30',
    fontWeight: '400',
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonIcon: {
    width: 16,
    height: 16,
  },
  saveButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  labelIcon: {
    width: 16,
    height: 16,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    borderWidth: 0.5,
    borderColor: '#C6C6C8',
    color: '#1D1D1F',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  cadenceGroup: {
    marginBottom: 16,
  },
  cadenceTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#C6C6C8',
    marginBottom: 12,
    gap: 12,
  },
  selectedCadenceType: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  cadenceTypeIcon: {
    width: 20,
    height: 20,
  },
  cadenceTypeText: {
    fontSize: 17,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  selectedCadenceTypeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  intervalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  intervalButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: '#C6C6C8',
  },
  selectedInterval: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  intervalText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  selectedIntervalText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  dateOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dateOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#C6C6C8',
    justifyContent: 'center',
    gap: 8,
  },
  selectedDateOption: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  dateOptionIcon: {
    width: 16,
    height: 16,
  },
  dateOptionText: {
    fontSize: 17,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  selectedDateOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  datePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  datePreviewIcon: {
    width: 16,
    height: 16,
  },
  datePreview: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
});
