import {
  Circle,
  HStack,
  Image,
  Rectangle,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import {
  background,
  clipShape,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type {
  WidgetDisplayTask,
  WidgetIosSnapshot,
} from '../../lib/widgetPayloads';

/**
 * expo-widgets serializes this function's source and evaluates it in an
 * isolated runtime: imports and module scope are unavailable inside the body.
 * Only `props`, `environment`, body-local declarations, and the runtime
 * globals (the @expo/ui components and modifiers) can be referenced. All data
 * must arrive resolved via props; see `widgets/iosWidget.ts`.
 */
const CadenceWidget = (
  props: WidgetIosSnapshot,
  environment: WidgetEnvironment
) => {
  'widget';
  const cadenceBlue = '#0A85FF';
  const cadenceRed = '#FF3B30';
  const cadenceGreen = '#33C759';
  const secondary: Parameters<typeof foregroundStyle>[0] = {
    type: 'hierarchical',
    style: 'secondary',
  };

  const allClearGreen = '#1B7A33';

  const isDark = environment.colorScheme === 'dark';
  const isSmall = environment.widgetFamily === 'systemSmall';
  const isLarge = environment.widgetFamily === 'systemLarge';
  const tasks = props.tasks ?? [];
  const overdueCount = props.overdueCount ?? 0;
  const todayCount = props.todayCount ?? 0;
  const totalCount = props.totalCount ?? 0;
  const urgentCount = overdueCount + todayCount;
  const isAllClear = totalCount > 0 && urgentCount === 0;
  const maxRows = environment.widgetFamily === 'systemLarge' ? 6 : 3;
  const rows = tasks.slice(0, maxRows);
  const upcoming = tasks
    .filter(t => t.status === 'upcoming')
    .slice(0, isLarge ? 4 : 2);
  const separatorColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const dueColor = (task: WidgetDisplayTask) =>
    task.status === 'overdue'
      ? cadenceRed
      : task.status === 'today'
        ? cadenceBlue
        : secondary;

  const taskTile = (task: WidgetDisplayTask, size: number) => {
    const overdue = task.status === 'overdue';
    const bg = overdue
      ? isDark
        ? 'rgba(255,69,59,0.20)'
        : '#FFE6E6'
      : isDark
        ? task.tintDark
        : task.tint;
    const fg = overdue ? cadenceRed : isDark ? task.accentDark : task.accent;
    return (
      <ZStack modifiers={[frame({ width: size, height: size })]}>
        <RoundedRectangle
          cornerRadius={Math.max(7, size * 0.28)}
          modifiers={[foregroundStyle(bg)]}
        />
        <Image
          systemName={task.symbol}
          modifiers={[
            font({ size: Math.round(size * 0.52), weight: 'semibold' }),
            foregroundStyle(fg),
          ]}
        />
      </ZStack>
    );
  };

  const smallRow = (task: WidgetDisplayTask) => (
    <HStack spacing={8}>
      {taskTile(task, 26)}
      <VStack alignment="leading" spacing={1}>
        <Text
          modifiers={[
            font({ size: 12.5, weight: 'semibold' }),
            foregroundStyle('primary'),
            lineLimit(1),
          ]}
        >
          {task.title}
        </Text>
        <Text
          modifiers={[
            font({ size: 10.5, weight: 'medium' }),
            foregroundStyle(dueColor(task)),
          ]}
        >
          {task.dueLabel}
        </Text>
      </VStack>
    </HStack>
  );

  const mediumRow = (task: WidgetDisplayTask) => (
    <HStack spacing={10}>
      {taskTile(task, 28)}
      <Text
        modifiers={[
          font({ size: 14, weight: 'semibold' }),
          foregroundStyle('primary'),
          lineLimit(1),
        ]}
      >
        {task.title}
      </Text>
      <Spacer />
      <Text
        modifiers={[
          font({ size: 12, weight: 'semibold' }),
          foregroundStyle(dueColor(task)),
        ]}
      >
        {task.dueLabel}
      </Text>
    </HStack>
  );

  const headerLabel = () => {
    if (totalCount === 0) return 'No tasks';
    if (overdueCount > 0 && todayCount > 0) {
      return `${overdueCount} overdue · ${todayCount} today`;
    }
    if (overdueCount > 0) return `${overdueCount} overdue`;
    if (todayCount === 0) return 'Nothing due today';
    return todayCount === 1 ? '1 due today' : `${todayCount} due today`;
  };

  const countColor =
    overdueCount > 0 ? cadenceRed : todayCount > 0 ? cadenceBlue : cadenceGreen;
  const labelColor =
    overdueCount > 0 ? cadenceRed : todayCount > 0 ? cadenceBlue : secondary;

  const smallSeparator = () => (
    <Rectangle
      modifiers={[frame({ height: 1 }), foregroundStyle(separatorColor)]}
    />
  );

  const statPill = (label: string, value: number, barColor: string) => (
    <HStack spacing={7} modifiers={[frame({ maxWidth: Infinity })]}>
      <RoundedRectangle
        cornerRadius={1.5}
        modifiers={[frame({ width: 3, height: 38 }), foregroundStyle(barColor)]}
      />
      <VStack alignment="leading" spacing={2}>
        <Text
          modifiers={[
            font({ size: 10, weight: 'semibold' }),
            foregroundStyle(secondary),
          ]}
        >
          {label}
        </Text>
        <Text
          modifiers={[
            font({ size: 22, weight: 'bold' }),
            foregroundStyle('primary'),
          ]}
        >
          {`${value}`}
        </Text>
      </VStack>
      <Spacer />
    </HStack>
  );

  const statsRow = () => (
    <HStack spacing={14}>
      {statPill('OVERDUE', overdueCount, cadenceRed)}
      {statPill('TODAY', todayCount, cadenceBlue)}
      {statPill('TOTAL', totalCount, '#8E8E93')}
    </HStack>
  );

  const nextUpHeading = (size: number) => (
    <Text
      modifiers={[font({ size, weight: 'bold' }), foregroundStyle(secondary)]}
    >
      NEXT UP
    </Text>
  );

  const allClearView = () =>
    isSmall ? (
      <VStack alignment="leading" spacing={8}>
        <HStack
          spacing={5}
          modifiers={[
            padding({ leading: 5, trailing: 8, top: 3, bottom: 3 }),
            background('rgba(51,199,89,0.14)'),
            clipShape('capsule'),
          ]}
        >
          <ZStack modifiers={[frame({ width: 14, height: 14 })]}>
            <Circle
              modifiers={[
                frame({ width: 14, height: 14 }),
                foregroundStyle(cadenceGreen),
              ]}
            />
            <Image
              systemName="checkmark"
              modifiers={[
                font({ size: 7, weight: 'heavy' }),
                foregroundStyle('white'),
              ]}
            />
          </ZStack>
          <Text
            modifiers={[
              font({ size: 10.5, weight: 'bold' }),
              foregroundStyle(isDark ? cadenceGreen : allClearGreen),
            ]}
          >
            All clear today
          </Text>
        </HStack>
        {upcoming.length > 0 && (
          <VStack alignment="leading" spacing={8}>
            {nextUpHeading(9.5)}
            <VStack alignment="leading" spacing={10}>
              {upcoming.map(task => smallRow(task))}
            </VStack>
          </VStack>
        )}
      </VStack>
    ) : isLarge ? (
      <VStack alignment="leading" spacing={8}>
        <HStack
          spacing={10}
          modifiers={[
            padding({ all: 10 }),
            background('rgba(51,199,89,0.12)'),
            clipShape('roundedRectangle', 12),
          ]}
        >
          <ZStack modifiers={[frame({ width: 34, height: 34 })]}>
            <Circle
              modifiers={[
                frame({ width: 34, height: 34 }),
                foregroundStyle('rgba(51,199,89,0.25)'),
              ]}
            />
            <Image
              systemName="checkmark"
              modifiers={[
                font({ size: 16, weight: 'bold' }),
                foregroundStyle(cadenceGreen),
              ]}
            />
          </ZStack>
          <Text
            modifiers={[
              font({ size: 15, weight: 'bold' }),
              foregroundStyle(isDark ? cadenceGreen : allClearGreen),
            ]}
          >
            All clear today
          </Text>
          <Spacer />
        </HStack>
        {upcoming.length > 0 && (
          <VStack alignment="leading" spacing={4}>
            <Text
              modifiers={[
                font({ size: 10, weight: 'bold' }),
                foregroundStyle(secondary),
              ]}
            >
              COMING UP
            </Text>
            <VStack spacing={0}>
              {upcoming.map((task, i) => (
                <VStack key={task.id} alignment="leading" spacing={0}>
                  {i > 0 && smallSeparator()}
                  <VStack modifiers={[padding({ top: 6, bottom: 6 })]}>
                    {mediumRow(task)}
                  </VStack>
                </VStack>
              ))}
            </VStack>
          </VStack>
        )}
      </VStack>
    ) : (
      <VStack alignment="leading" spacing={6}>
        <HStack spacing={10}>
          <ZStack modifiers={[frame({ width: 28, height: 28 })]}>
            <Circle
              modifiers={[
                frame({ width: 28, height: 28 }),
                foregroundStyle('rgba(51,199,89,0.15)'),
              ]}
            />
            <Image
              systemName="checkmark"
              modifiers={[
                font({ size: 14, weight: 'bold' }),
                foregroundStyle(cadenceGreen),
              ]}
            />
          </ZStack>
          <Text
            modifiers={[
              font({ size: 15, weight: 'bold' }),
              foregroundStyle('primary'),
            ]}
          >
            All clear
          </Text>
        </HStack>
        {upcoming.length > 0 && (
          <VStack alignment="leading" spacing={6}>
            {nextUpHeading(9)}
            <VStack alignment="leading" spacing={6}>
              {upcoming.map(task => mediumRow(task))}
            </VStack>
          </VStack>
        )}
      </VStack>
    );

  return (
    <VStack
      alignment="leading"
      spacing={isSmall ? 4 : 6}
      modifiers={[
        frame({
          maxWidth: Infinity,
          maxHeight: Infinity,
          alignment: 'topLeading',
        }),
        containerBackground(isDark ? '#1C1C1E' : '#FFFFFF', 'widget'),
      ]}
    >
      <HStack>
        <Text
          modifiers={[
            font({ size: isSmall ? 13 : 14, weight: 'bold' }),
            foregroundStyle(cadenceBlue),
          ]}
        >
          Cadence
        </Text>
        <Spacer />
        {isSmall ? (
          totalCount > 0 && (
            <Text
              modifiers={[
                font({ size: 14, weight: 'bold' }),
                foregroundStyle(countColor),
              ]}
            >
              {`${urgentCount}`}
            </Text>
          )
        ) : isLarge ? null : (
          <Text
            modifiers={[
              font({ size: 12, weight: 'semibold' }),
              foregroundStyle(labelColor),
            ]}
          >
            {headerLabel()}
          </Text>
        )}
      </HStack>
      {isLarge && totalCount > 0 && statsRow()}
      {totalCount === 0 ? (
        <VStack
          modifiers={[frame({ maxWidth: Infinity, maxHeight: Infinity })]}
        >
          <Text
            modifiers={[
              font({ size: 12, weight: 'medium' }),
              foregroundStyle(secondary),
            ]}
          >
            No tasks yet. Open app to start.
          </Text>
        </VStack>
      ) : isAllClear ? (
        allClearView()
      ) : isSmall ? (
        <VStack
          alignment="leading"
          spacing={4}
          modifiers={[padding({ top: 8 })]}
        >
          {rows.map((task, i) => (
            <VStack key={task.id} alignment="leading" spacing={4}>
              {i > 0 && smallSeparator()}
              {smallRow(task)}
            </VStack>
          ))}
        </VStack>
      ) : isLarge ? (
        <VStack spacing={0}>
          {rows.map((task, i) => (
            <VStack key={task.id} alignment="leading" spacing={0}>
              {i > 0 && smallSeparator()}
              <VStack modifiers={[padding({ top: 6, bottom: 6 })]}>
                {mediumRow(task)}
              </VStack>
            </VStack>
          ))}
        </VStack>
      ) : (
        <VStack spacing={6}>{rows.map(task => mediumRow(task))}</VStack>
      )}
    </VStack>
  );
};

export default createWidget('CadenceWidget', CadenceWidget);
