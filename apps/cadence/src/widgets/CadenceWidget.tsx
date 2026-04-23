'use no memo';

import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface WidgetTask {
  id: string;
  title: string;
  nextDueDate: number;
  isDueToday?: boolean;
}

interface CadenceWidgetProps {
  tasks: WidgetTask[];
}

const COLORS = {
  blue: '#007AFF',
  red: '#FF3B30',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#C7C7CC',
  background: '#F2F2F7',
};

function isOverdue(timestamp: number): boolean {
  const dueDate = new Date(timestamp);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return dueDate.getTime() < today.getTime();
}

function isDueToday(timestamp: number): boolean {
  const dueDate = new Date(timestamp);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return dueDate.getTime() === today.getTime();
}

function formatDueDate(timestamp: number): string {
  const dueDate = new Date(timestamp);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `in ${diffDays} days`;
}

function StatusCircle({ isOverdue: overdue }: { isOverdue: boolean }) {
  return (
    <FlexWidget
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: overdue ? COLORS.red : COLORS.blue,
      }}
    />
  );
}

function TaskRow({
  task,
  showSeparator,
}: {
  task: WidgetTask;
  showSeparator: boolean;
}) {
  const taskIsOverdue = isOverdue(task.nextDueDate);

  return (
    <FlexWidget style={{ width: 'match_parent' }}>
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 'match_parent',
          paddingVertical: 4,
        }}
      >
        <FlexWidget style={{ flex: 1, marginRight: 8 }}>
          <TextWidget
            text={task.title}
            style={{
              fontSize: 14,
              color: COLORS.black,
            }}
            maxLines={1}
          />
        </FlexWidget>
        <StatusCircle isOverdue={taskIsOverdue} />
      </FlexWidget>
      {showSeparator && (
        <FlexWidget
          style={{
            height: 1,
            width: 'match_parent',
            backgroundColor: COLORS.lightGray,
            marginVertical: 4,
          }}
        />
      )}
    </FlexWidget>
  );
}

function NextUpView({ task }: { task: WidgetTask }) {
  return (
    <FlexWidget style={{ width: 'match_parent' }}>
      <TextWidget
        text="Next up"
        style={{
          fontSize: 12,
          color: COLORS.gray,
        }}
      />
      <TextWidget
        text={task.title}
        style={{
          fontSize: 14,
          color: COLORS.black,
          marginTop: 4,
        }}
        maxLines={3}
      />
      <TextWidget
        text={formatDueDate(task.nextDueDate)}
        style={{
          fontSize: 11,
          color: COLORS.gray,
          marginTop: 2,
        }}
      />
    </FlexWidget>
  );
}

export function CadenceWidget({ tasks }: CadenceWidgetProps) {
  const overdueTasks = tasks.filter(t => isOverdue(t.nextDueDate));
  const dueTodayTasks = tasks.filter(
    t => isDueToday(t.nextDueDate) && !isOverdue(t.nextDueDate)
  );
  const upcomingTasks = tasks.filter(
    t => !isOverdue(t.nextDueDate) && !isDueToday(t.nextDueDate)
  );

  const urgentTasks = [...overdueTasks, ...dueTodayTasks];
  const urgentCount = urgentTasks.length;
  const displayTasks = urgentTasks.slice(0, 3);
  const nextTask = upcomingTasks.sort(
    (a, b) => a.nextDueDate - b.nextDueDate
  )[0];

  return (
    <FlexWidget
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 16,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'match_parent',
          marginBottom: 12,
        }}
      >
        <TextWidget
          text="Cadence"
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: COLORS.blue,
          }}
        />
        <TextWidget
          text={String(urgentCount)}
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: COLORS.black,
          }}
        />
      </FlexWidget>

      {tasks.length === 0 ? (
        <TextWidget
          text="no tasks"
          style={{
            fontSize: 14,
            color: COLORS.black,
          }}
        />
      ) : displayTasks.length > 0 ? (
        <FlexWidget style={{ width: 'match_parent' }}>
          {displayTasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              showSeparator={index < displayTasks.length - 1}
            />
          ))}
        </FlexWidget>
      ) : nextTask ? (
        <NextUpView task={nextTask} />
      ) : null}
    </FlexWidget>
  );
}
