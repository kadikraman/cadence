'use no memo';

import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { WidgetTask } from '../../lib/widgetPayloads';
import { bucketize, dueColor, formatDue, M3, TaskTile } from './parts';

export function Large({ tasks }: { tasks: WidgetTask[] }) {
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
          padding: 20,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FlexWidget
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: M3.primaryContainer,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text="+"
            style={{ fontSize: 44, color: M3.primary, fontWeight: '500' }}
          />
        </FlexWidget>
        <TextWidget
          text="Build your rhythm"
          style={{
            fontSize: 17,
            fontWeight: '500',
            color: M3.label,
            marginTop: 16,
          }}
        />
        <TextWidget
          text="Add recurring tasks."
          style={{
            fontSize: 12,
            color: M3.label2,
            marginTop: 4,
          }}
        />
      </FlexWidget>
    );
  }

  const overdueCount = overdue.length;
  const todayCount = today.length;
  const allClear = overdueCount === 0 && todayCount === 0;

  const ordered = [...overdue, ...today, ...upcoming];
  const maxRows = allClear ? 4 : 6;
  const displayed = ordered.slice(0, maxRows);
  const extra =
    todayCount + overdueCount > maxRows
      ? todayCount + overdueCount - Math.min(maxRows, todayCount + overdueCount)
      : 0;

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        backgroundColor: M3.surface3,
        padding: 20,
        borderRadius: 28,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text="Cadence"
          style={{ fontSize: 15, fontWeight: '500', color: M3.primary }}
        />
      </FlexWidget>

      <FlexWidget
        style={{
          flexDirection: 'row',
          width: 'match_parent',
          marginTop: 10,
        }}
      >
        <FlexWidget
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: overdueCount > 0 ? M3.errorContainer : M3.surface2,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginRight: 6,
          }}
        >
          <TextWidget
            text="OVERDUE"
            style={{
              fontSize: 9,
              fontWeight: '500',
              color: overdueCount > 0 ? M3.onErrorContainer : M3.label2,
            }}
          />
          <TextWidget
            text={String(overdueCount)}
            style={{
              fontSize: 22,
              fontWeight: '500',
              color: overdueCount > 0 ? M3.onErrorContainer : M3.label2,
              marginTop: 2,
            }}
          />
        </FlexWidget>
        <FlexWidget
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: M3.primaryContainer,
            paddingHorizontal: 10,
            paddingVertical: 8,
            marginRight: 6,
          }}
        >
          <TextWidget
            text="TODAY"
            style={{
              fontSize: 9,
              fontWeight: '500',
              color: M3.onPrimaryContainer,
            }}
          />
          <TextWidget
            text={String(todayCount)}
            style={{
              fontSize: 22,
              fontWeight: '500',
              color: M3.onPrimaryContainer,
              marginTop: 2,
            }}
          />
        </FlexWidget>
        <FlexWidget
          style={{
            flex: 1,
            borderRadius: 16,
            backgroundColor: M3.secondaryContainer,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}
        >
          <TextWidget
            text="TOTAL"
            style={{
              fontSize: 9,
              fontWeight: '500',
              color: M3.onSecondaryContainer,
            }}
          />
          <TextWidget
            text={String(totalTasks)}
            style={{
              fontSize: 22,
              fontWeight: '500',
              color: M3.onSecondaryContainer,
              marginTop: 2,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {allClear && (
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
            marginTop: 12,
            padding: 12,
            borderRadius: 16,
            backgroundColor: M3.greenContainer,
          }}
        >
          <FlexWidget
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: M3.green,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextWidget
              text="✓"
              style={{ fontSize: 18, color: '#fff', fontWeight: '500' }}
            />
          </FlexWidget>
          <TextWidget
            text="All clear today"
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: M3.onGreenContainer,
              marginLeft: 10,
            }}
          />
        </FlexWidget>
      )}

      {displayed.length > 0 && (
        <TextWidget
          text={allClear ? 'COMING UP' : 'NEXT'}
          style={{
            fontSize: 10,
            fontWeight: '500',
            color: M3.label2,
            marginTop: 12,
            marginBottom: 2,
          }}
        />
      )}

      {displayed.map((t, i) => (
        <FlexWidget key={t.id} style={{ width: 'match_parent' }}>
          {i > 0 && (
            <FlexWidget
              style={{
                height: 1,
                width: 'match_parent',
                backgroundColor: M3.outlineVariant,
              }}
            />
          )}
          <FlexWidget
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 'match_parent',
              paddingVertical: 6,
            }}
          >
            <TaskTile task={t} size={28} />
            <FlexWidget style={{ flex: 1, marginLeft: 12 }}>
              <TextWidget
                text={t.title}
                style={{ fontSize: 13, color: M3.label }}
                maxLines={1}
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
        </FlexWidget>
      ))}

      {extra > 0 && (
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
            marginTop: 6,
          }}
        >
          <FlexWidget
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 100,
              backgroundColor: M3.primaryContainer,
            }}
          >
            <TextWidget
              text={`+ ${extra} more due today`}
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
