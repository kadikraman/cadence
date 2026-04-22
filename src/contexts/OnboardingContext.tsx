import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'onboardingSeen';

type Value = {
  hasSeen: boolean | null;
  markSeen: () => Promise<void>;
};

const OnboardingContext = createContext<Value | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => setHasSeen(v === '1'));
  }, []);

  const markSeen = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '1');
    setHasSeen(true);
  }, []);

  return (
    <OnboardingContext.Provider value={{ hasSeen, markSeen }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
