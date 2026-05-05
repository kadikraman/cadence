import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSettingsStore } from '../../stores/settings';

export type Visual = 'hero' | 'jiggle' | 'plus' | 'sizes';

export interface Step {
  title: string;
  body: string;
  visual: Visual;
}

export function useOnboarding(stepCount: number) {
  const router = useRouter();
  const setOnboardingSeen = useSettingsStore(s => s.setOnboardingSeen);
  const [step, setStep] = useState(0);
  const isReplay = router.canGoBack();

  const close = async () => {
    await setOnboardingSeen();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  const next = () => (step === stepCount - 1 ? close() : setStep(step + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  return { router, step, next, back, close, isReplay };
}
