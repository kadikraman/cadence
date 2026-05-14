'use no memo';

import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { WidgetTask } from '../../lib/widgetPayloads';
import { bucketize, dueColor, formatDue, M3, TaskTile } from './parts';

export function Medium({ tasks }: { tasks: WidgetTask[] }) {
  const { overdue, today, upcoming } = bucketize(tasks);
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          flexDirection: 'column',
          backgroundColor: M3.surface3,
          padding: 16,
          borderRadius: 28,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
          }}
        >
          <TextWidget
            text="Cadence"
            style={{ fontSize: 14, fontWeight: '500', color: M3.primary }}
          />
        </FlexWidget>
        <FlexWidget
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
            marginTop: 6,
          }}
        >
          <FlexWidget
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: M3.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextWidget
              text="+"
              style={{ fontSize: 28, color: M3.primary, fontWeight: '500' }}
            />
          </FlexWidget>
          <FlexWidget style={{ flex: 1, marginLeft: 14 }}>
            <TextWidget
              text="Build your rhythm"
              style={{ fontSize: 15, fontWeight: '500', color: M3.label }}
            />
            <TextWidget
              text="Add recurring tasks."
              style={{ fontSize: 11, color: M3.label2, marginTop: 3 }}
              maxLines={2}
            />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    );
  }

  const overdueCount = overdue.length;
  const todayCount = today.length;
  const urgent = [...overdue, ...today, ...upcoming];
  const displayed = urgent.slice(0, 3);
  const extra =
    todayCount + overdueCount - Math.min(3, overdueCount + todayCount);

  let headerLabel: string;
  let headerTone: 'default' | 'error' = 'default';
  if (overdueCount > 0 && todayCount > 0) {
    headerLabel = `${overdueCount} overdue · ${todayCount} today`;
    headerTone = 'error';
  } else if (overdueCount > 0) {
    headerLabel = `${overdueCount} overdue`;
    headerTone = 'error';
  } else if (todayCount > 0) {
    headerLabel = `${todayCount} due today`;
  } else {
    headerLabel = 'Nothing due today';
  }

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        backgroundColor: M3.surface3,
        padding: 16,
        borderRadius: 28,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 4,
        }}
      >
        <TextWidget
          text="Cadence"
          style={{ fontSize: 14, fontWeight: '500', color: M3.primary }}
        />
        <TextWidget
          text={headerLabel}
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: headerTone === 'error' ? M3.error : M3.label2,
          }}
        />
      </FlexWidget>
      {displayed.map(t => (
        <FlexWidget
          key={t.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
            paddingVertical: 4,
          }}
        >
          <TaskTile task={t} size={28} />
          <FlexWidget style={{ flex: 1, marginLeft: 12 }}>
            <TextWidget
              text={t.title}
              style={{ fontSize: 13, color: M3.label }}
              maxLines={1}
              truncate="END"
            />
          </FlexWidget>
          <TextWidget
            text={formatDue(t.nextDueDate)}
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: dueColor(t),
            }}
          />
        </FlexWidget>
      ))}
      {extra > 0 && (
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
            marginTop: 4,
          }}
        >
          <FlexWidget
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 100,
              backgroundColor: M3.primaryContainer,
            }}
          >
            <TextWidget
              text={`+ ${extra} more today`}
              style={{
                fontSize: 11,
                fontWeight: '500',
                color: M3.onPrimaryContainer,
              }}
            />
          </FlexWidget>
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
