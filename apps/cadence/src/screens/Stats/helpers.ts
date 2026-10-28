import { addDays } from '../../utils/taskUtils';

export interface Tick {
  line: number;
  at: number;
  label: string;
}

const formatTick = (ts: number, options: Intl.DateTimeFormatOptions) =>
  new Date(ts).toLocaleString('en-US', options);

export const rangeTicks = (start: number, end: number, days: number) => {
  const out: Tick[] = [];
  if (days <= 7) {
    for (let ts = start; ts < end; ts = addDays(ts, 1)) {
      const next = addDays(ts, 1);
      out.push({
        line: ts,
        at: (ts + next) / 2,
        label: formatTick(ts, { weekday: 'narrow' }),
      });
    }
  } else if (days <= 30) {
    for (let ts = start; ts < end; ts = addDays(ts, 1)) {
      if (new Date(ts).getDay() === 1) {
        out.push({
          line: ts,
          at: ts,
          label: formatTick(ts, { month: 'short', day: 'numeric' }),
        });
      }
    }
  } else {
    const d = new Date(start);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    while (d.getTime() < end) {
      if (days <= 90 || d.getMonth() % 2 === 0) {
        out.push({
          line: d.getTime(),
          at: d.getTime(),
          label: formatTick(d.getTime(), { month: 'short' }),
        });
      }
      d.setMonth(d.getMonth() + 1);
    }
  }
  return out;
};
