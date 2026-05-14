'use no memo';

import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { WidgetTask } from '../../lib/widgetPayloads';
import {
  bucketize,
  dueColor,
  firstLetter,
  formatDue,
  M3,
  TaskTile,
  tintFor,
} from './parts';

export function Small({ tasks }: { tasks: WidgetTask[] }) {
  const { overdue, today, upcoming } = bucketize(tasks);
  const urgent = [...overdue, ...today];
  const urgentCount = urgent.length;
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          flexDirection: 'column',
          backgroundColor: M3.primaryContainer,
          padding: 16,
          borderRadius: 28,
        }}
      >
        <TextWidget
          text="Cadence"
          style={{
            fontSize: 13,
            fontWeight: '500',
            color: M3.onPrimaryContainer,
          }}
        />
        <FlexWidget
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <FlexWidget
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: M3.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextWidget
              text="+"
              style={{ fontSize: 28, color: M3.onPrimary, fontWeight: '500' }}
            />
          </FlexWidget>
          <TextWidget
            text="No tasks"
            style={{
              fontSize: 12,
              color: M3.onPrimaryContainer,
              marginTop: 8,
            }}
          />
        </FlexWidget>
      </FlexWidget>
    );
  }

  if (urgentCount === 0) {
    const next = upcoming[0];
    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          flexDirection: 'column',
          backgroundColor: M3.greenContainer,
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
          }}
        >
          <TextWidget
            text="Cadence"
            style={{
              fontSize: 13,
              fontWeight: '500',
              color: M3.onGreenContainer,
            }}
          />
          <TextWidget
            text="0"
            style={{ fontSize: 20, fontWeight: '500', color: M3.green }}
          />
        </FlexWidget>
        <FlexWidget
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: M3.green,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}
        >
          <TextWidget
            text="✓"
            style={{ fontSize: 20, color: '#fff', fontWeight: '500' }}
          />
        </FlexWidget>
        <TextWidget
          text="All clear"
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: M3.onGreenContainer,
            marginTop: 8,
          }}
        />
        {next && (
          <TextWidget
            text={`Next: ${next.title} · ${formatDue(next.nextDueDate)}`}
            style={{
              fontSize: 10,
              color: M3.onGreenContainer,
              marginTop: 4,
            }}
            maxLines={1}
          />
        )}
      </FlexWidget>
    );
  }

  const hasOverdue = overdue.length > 0;
  const highCount = urgentCount >= 5;
  const redTone = hasOverdue || highCount;
  const bg = redTone ? M3.errorContainer : M3.primaryContainer;
  const fg = redTone ? M3.onErrorContainer : M3.onPrimaryContainer;
  const countColor = redTone ? M3.error : M3.onPrimaryContainer;

  if (urgentCount === 1 && upcoming.length === 0) {
    const t = urgent[0];
    const tint = hasOverdue
      ? { tint: M3.errorContainer, fg: M3.error }
      : tintFor(t.color);
    const eyebrow = hasOverdue ? formatDue(t.nextDueDate).toUpperCase() : 'TODAY';
    const eyebrowColor = hasOverdue ? M3.error : M3.primary;
    return (
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 'match_parent',
          flexDirection: 'column',
          backgroundColor: bg,
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
          }}
        >
          <TextWidget
            text="Cadence"
            style={{ fontSize: 13, fontWeight: '500', color: fg }}
          />
          <TextWidget
            text="1"
            style={{ fontSize: 20, fontWeight: '500', color: countColor }}
          />
        </FlexWidget>
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 'match_parent',
            marginTop: 10,
          }}
        >
          <FlexWidget
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: tint.tint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextWidget
              text={firstLetter(t.title)}
              style={{ fontSize: 16, fontWeight: '500', color: tint.fg }}
            />
          </FlexWidget>
          <FlexWidget style={{ flex: 1, marginLeft: 10 }}>
            <TextWidget
              text={eyebrow}
              style={{
                fontSize: 9,
                fontWeight: '500',
                color: eyebrowColor,
              }}
            />
            <TextWidget
              text={t.title}
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: fg,
                marginTop: 2,
              }}
              maxLines={1}
            />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>
    );
  }

  const combined = [...urgent, ...upcoming];
  const displayed = combined.slice(0, 3);
  const extra = Math.max(0, urgentCount - displayed.length);

  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        backgroundColor: bg,
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
        }}
      >
        <TextWidget
          text="Cadence"
          style={{ fontSize: 13, fontWeight: '500', color: fg }}
        />
        <TextWidget
          text={String(urgentCount)}
          style={{ fontSize: 20, fontWeight: '500', color: countColor }}
        />
      </FlexWidget>
      <FlexWidget style={{ marginTop: 10, width: 'match_parent' }}>
        {displayed.map((t, i) => (
          <FlexWidget key={t.id} style={{ width: 'match_parent' }}>
            {i > 0 && (
              <FlexWidget
                style={{
                  height: 1,
                  width: 'match_parent',
                  backgroundColor: hasOverdue
                    ? 'rgba(65, 0, 2, 0.12)'
                    : 'rgba(0, 29, 54, 0.1)',
                  marginVertical: 6,
                }}
              />
            )}
            <FlexWidget
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 'match_parent',
              }}
            >
              <TaskTile task={t} size={26} />
              <FlexWidget style={{ flex: 1, marginLeft: 8 }}>
                <TextWidget
                  text={t.title}
                  style={{ fontSize: 12, fontWeight: '500', color: fg }}
                  maxLines={1}
                />
                <TextWidget
                  text={formatDue(t.nextDueDate)}
                  style={{
                    fontSize: 10,
                    color: dueColor(t),
                    marginTop: 1,
                  }}
                  maxLines={1}
                />
              </FlexWidget>
            </FlexWidget>
          </FlexWidget>
        ))}
        {extra > 0 && (
          <TextWidget
            text={`+ ${extra} more`}
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: hasOverdue ? M3.error : M3.primary,
              marginTop: 8,
            }}
          />
        )}
      </FlexWidget>
    </FlexWidget>
  );
}
