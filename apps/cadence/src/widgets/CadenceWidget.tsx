'use no memo';

import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface WidgetTask {
  id: string;
  title: string;
  color: string;
  glyph: string;
  nextDueDate: number;
  isDueToday?: boolean;
  isOverdue?: boolean;
}

interface CadenceWidgetProps {
  tasks: WidgetTask[];
  width: number;
  height: number;
}

// Material 3 (Material You) color roles.
const M3 = {
  primary: '#0061A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D1E4FF',
  onPrimaryContainer: '#001D36',
  secondaryContainer: '#D7E3F8',
  onSecondaryContainer: '#101C2B',
  surface: '#FEF7FF',
  surface2: '#F7F2FA',
  surface3: '#F3EDF7',
  label: '#1D1B20',
  label2: '#49454F',
  label3: '#79747E',
  outlineVariant: '#CAC4D0',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  green: '#146C2E',
  greenContainer: '#B0F1B7',
  onGreenContainer: '#002108',
  onErrorContainerDim: '#6B2E2E',
};

// Warmer, less-saturated tints than the iOS palette — matches the design canvas.
const TILE_TINTS: Record<string, { tint: string; fg: string }> = {
  red: { tint: '#FFDAD6', fg: '#BA1A1A' },
  maroon: { tint: '#FFDAD6', fg: '#8B2C1A' },
  orange: { tint: '#FFDDB3', fg: '#8B5000' },
  peach: { tint: '#FFE0CC', fg: '#7C4A20' },
  yellow: { tint: '#F3E9C7', fg: '#6F5D10' },
  olive: { tint: '#E4E9BA', fg: '#4F571B' },
  green: { tint: '#B0F1B7', fg: '#135322' },
  forest: { tint: '#A5DDB3', fg: '#0B4A1E' },
  mint: { tint: '#BEEAD5', fg: '#114D3B' },
  teal: { tint: '#B8EEEA', fg: '#00504C' },
  cyan: { tint: '#BDE5F0', fg: '#004E61' },
  blue: { tint: '#D1E4FF', fg: '#00497D' },
  indigo: { tint: '#D8DFFF', fg: '#1F2F77' },
  purple: { tint: '#EADDFF', fg: '#4F378B' },
  lavender: { tint: '#E6DEFF', fg: '#403972' },
  pink: { tint: '#FFD8E4', fg: '#7D2E4E' },
  rose: { tint: '#FFD9DF', fg: '#7D2D3F' },
  slate: { tint: '#DDE2EB', fg: '#3D4450' },
  brown: { tint: '#E4D8CA', fg: '#4E3A1C' },
  gray: { tint: '#E1E3E6', fg: '#44474F' },
};

function tintFor(colorKey: string | undefined) {
  return TILE_TINTS[colorKey ?? 'gray'] ?? TILE_TINTS.gray;
}

function firstLetter(title: string): string {
  const trimmed = title.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

function isOverdueTs(timestamp: number): boolean {
  const due = new Date(timestamp);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

function isTodayTs(timestamp: number): boolean {
  const due = new Date(timestamp);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
}

function formatDue(timestamp: number): string {
  const due = new Date(timestamp);
  const today = new Date();
  const dueM = new Date(timestamp);
  dueM.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (dueM.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tmrw';
  if (diffDays === -1) return '1d overdue';
  if (diffDays < 0) return `${-diffDays}d overdue`;
  if (diffDays < 7)
    return due.toLocaleDateString('en-US', { weekday: 'short' });
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function dueColor(task: WidgetTask): string {
  if (task.isOverdue ?? isOverdueTs(task.nextDueDate)) return M3.error;
  if (task.isDueToday ?? isTodayTs(task.nextDueDate)) return M3.primary;
  return M3.label2;
}

function bucketize(tasks: WidgetTask[]) {
  const today: WidgetTask[] = [];
  const overdue: WidgetTask[] = [];
  const upcoming: WidgetTask[] = [];
  for (const t of tasks) {
    if (t.isOverdue ?? isOverdueTs(t.nextDueDate)) overdue.push(t);
    else if (t.isDueToday ?? isTodayTs(t.nextDueDate)) today.push(t);
    else upcoming.push(t);
  }
  const sortByDue = (a: WidgetTask, b: WidgetTask) =>
    a.nextDueDate - b.nextDueDate;
  return {
    overdue: overdue.sort(sortByDue),
    today: today.sort(sortByDue),
    upcoming: upcoming.sort(sortByDue),
  };
}

// ─── Task tile ──────────────────────────────────────────────────────────────
function TaskTile({ task, size = 28 }: { task: WidgetTask; size?: number }) {
  const overdue = task.isOverdue ?? isOverdueTs(task.nextDueDate);
  const { tint, fg } = overdue
    ? { tint: M3.errorContainer, fg: M3.error }
    : tintFor(task.color);
  return (
    <FlexWidget
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size / 2),
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextWidget
        text={firstLetter(task.title)}
        style={{
          fontSize: Math.round(size * 0.48),
          fontWeight: '500',
          color: fg,
        }}
      />
    </FlexWidget>
  );
}

// ─── SMALL (2×2) ────────────────────────────────────────────────────────────
function SmallLayout({ tasks }: { tasks: WidgetTask[] }) {
  const { overdue, today, upcoming } = bucketize(tasks);
  const urgent = [...overdue, ...today];
  const urgentCount = urgent.length;
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    // Empty state: primaryContainer with big + circle
    return (
      <FlexWidget
        style={{
          flex: 1,
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

  // All-clear state
  if (urgentCount === 0) {
    const next = upcoming[0];
    return (
      <FlexWidget
        style={{
          flex: 1,
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
  const bg = hasOverdue ? M3.errorContainer : M3.primaryContainer;
  const fg = hasOverdue ? M3.onErrorContainer : M3.onPrimaryContainer;
  const countColor = hasOverdue ? M3.error : M3.onPrimaryContainer;

  // Single-task state: tile + label + title + Mark done pill (Today only)
  if (urgentCount === 1 && !hasOverdue) {
    const t = urgent[0];
    const tint = tintFor(t.color);
    return (
      <FlexWidget
        style={{
          flex: 1,
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
              text="TODAY"
              style={{
                fontSize: 9,
                fontWeight: '500',
                color: M3.primary,
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

  // Multi-task state: show up to 2 rows + "+N more" if needed
  const displayed = urgent.slice(0, 2);
  const extra = urgentCount - displayed.length;

  return (
    <FlexWidget
      style={{
        flex: 1,
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
                    ? 'rgba(65,0,2,0.12)'
                    : 'rgba(0,29,54,0.1)',
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

// ─── MEDIUM (4×2) ───────────────────────────────────────────────────────────
function MediumLayout({ tasks }: { tasks: WidgetTask[] }) {
  const { overdue, today, upcoming } = bucketize(tasks);
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return (
      <FlexWidget
        style={{
          flex: 1,
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
        flex: 1,
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
            alignSelf: 'flex-start',
            marginTop: 4,
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
      )}
    </FlexWidget>
  );
}

// ─── LARGE (4×4) ────────────────────────────────────────────────────────────
function LargeLayout({ tasks }: { tasks: WidgetTask[] }) {
  const { overdue, today, upcoming } = bucketize(tasks);
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return (
      <FlexWidget
        style={{
          flex: 1,
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
        flex: 1,
        flexDirection: 'column',
        backgroundColor: M3.surface3,
        padding: 20,
        borderRadius: 28,
      }}
    >
      {/* Header */}
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

      {/* Stat chips */}
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

      {/* All-clear callout (only when nothing is overdue or due today) */}
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

      {/* Coming up label (always when there are items to show) */}
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

      {/* Task rows */}
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
            alignSelf: 'flex-start',
            marginTop: 6,
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
      )}
    </FlexWidget>
  );
}

export function CadenceWidget({ tasks, width, height }: CadenceWidgetProps) {
  // Size detection thresholds match Pixel widget cells (roughly).
  // 2×2 ≈ 170dp square, 4×2 ≈ 360×170dp, 4×4 ≈ 360×360dp.
  const isLarge = width >= 220 && height >= 220;
  const isMedium = !isLarge && width >= 220;

  if (isLarge) return <LargeLayout tasks={tasks} />;
  if (isMedium) return <MediumLayout tasks={tasks} />;
  return <SmallLayout tasks={tasks} />;
}
