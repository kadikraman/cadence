import { Observe } from 'expo-observe';
import { errorReason } from './logs';

type Span = ReturnType<typeof Observe.startSpan>;

type SpanName =
  | 'sync'
  | 'sync.read_remote'
  | 'sync.write_local'
  | 'sync.write_remote';

type SpanEventName = 'sync.first_sync_recheck';

type SpanAttributes =
  | { outcome: 'synced' | 'unavailable' | 'unsupported' }
  | { writeLocal: boolean; writeRemote: boolean };

export interface TraceSpan {
  setAttributes: (attributes: SpanAttributes) => void;
  addEvent: (name: SpanEventName) => void;
  child: <T>(name: SpanName, run: () => Promise<T>) => Promise<T>;
}

async function runSpan<T>(
  name: SpanName,
  run: (span: TraceSpan) => Promise<T>,
  parent?: Span
): Promise<T> {
  const span = Observe.startSpan(name, { parent });
  const handle: TraceSpan = {
    setAttributes: attributes => span.setAttributes(attributes),
    addEvent: eventName => span.addEvent(eventName),
    child: (childName, childRun) => runSpan(childName, childRun, span),
  };
  try {
    const result = await run(handle);
    span.end();
    return result;
  } catch (err) {
    span.end({ status: 'error', message: errorReason(err) });
    throw err;
  }
}

export function trace<T>(
  name: SpanName,
  run: (span: TraceSpan) => Promise<T>
): Promise<T> {
  return runSpan(name, run);
}
