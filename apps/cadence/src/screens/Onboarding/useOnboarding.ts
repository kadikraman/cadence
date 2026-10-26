import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { logs } from '../../lib/logs';
import { routes } from '../../lib/routes';
import { useSyncSetting } from '../../lib/sync/useSyncSetting';
import { useSettingsStore } from '../../stores/settings';
import { Step } from './types';

export function useOnboarding(widgetSteps: Step[], syncStep: Step) {
  const router = useRouter();
  const setOnboardingSeen = useSettingsStore(s => s.setOnboardingSeen);
  const [step, setStep] = useState(0);
  const isReplay = router.canGoBack();
  const sync = useSyncSetting();

  const steps = useMemo(
    () => (isReplay ? widgetSteps : [...widgetSteps, syncStep]),
    [isReplay, widgetSteps, syncStep]
  );

  const finish = async () => {
    await setOnboardingSeen();
    if (router.canGoBack()) router.back();
    else router.replace(routes.home);
  };

  const next = () => {
    if (sync.busy) return;
    if (step === steps.length - 1) {
      logs.onboardingCompleted(isReplay);
      finish();
    } else {
      setStep(step + 1);
    }
  };

  return { steps, current: steps[step], step, next, isReplay, sync };
}
