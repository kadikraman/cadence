import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { getTodayTimestamp } from '../../utils/taskUtils';

export function useToday(): number {
  const [today, setToday] = useState(() => getTodayTimestamp());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        const current = getTodayTimestamp();
        setToday(prev => (prev === current ? prev : current));
      }
    });
    return () => subscription.remove();
  }, []);

  return today;
}
