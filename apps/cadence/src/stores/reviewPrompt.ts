import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  INITIAL_REVIEW_PROMPT_STATE,
  parseReviewPromptState,
  recordActiveDay as recordActiveDayReducer,
  recordCompletion as recordCompletionReducer,
  recordPrompt as recordPromptReducer,
  recordRated as recordRatedReducer,
  ReviewPromptState,
} from './reviewPromptReducers';

const STORAGE_KEY = 'reviewPrompt';

interface ReviewPromptStore extends ReviewPromptState {
  loaded: boolean;
  sessionStartedAt: number | null;
  load: () => Promise<void>;
  startSession: (now: number, today: number) => Promise<void>;
  recordCompletion: () => Promise<void>;
  recordPrompt: (today: number, version: string | null) => Promise<void>;
  recordRated: () => Promise<void>;
}

function pickState(store: ReviewPromptStore): ReviewPromptState {
  return {
    firstSeenDay: store.firstSeenDay,
    lastActiveDay: store.lastActiveDay,
    activeDays: store.activeDays,
    completions: store.completions,
    promptedDay: store.promptedDay,
    promptedVersion: store.promptedVersion,
    rated: store.rated,
  };
}

async function persist(state: ReviewPromptState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const useReviewPromptStore = create<ReviewPromptStore>((set, get) => {
  const apply =
    <Args extends readonly unknown[]>(
      reducer: (state: ReviewPromptState, ...args: Args) => ReviewPromptState
    ) =>
    async (...args: Args): Promise<void> => {
      const current = pickState(get());
      const next = reducer(current, ...args);
      if (next === current) return;
      set(next);
      await persist(next);
    };

  const recordActiveDay = apply(recordActiveDayReducer);

  return {
    ...INITIAL_REVIEW_PROMPT_STATE,
    loaded: false,
    sessionStartedAt: null,

    load: async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        set({
          ...parseReviewPromptState(json ? JSON.parse(json) : null),
          loaded: true,
        });
      } catch {
        set({ loaded: true });
      }
    },

    startSession: async (now, today) => {
      set({ sessionStartedAt: now });
      await recordActiveDay(today);
    },

    recordCompletion: apply(recordCompletionReducer),
    recordPrompt: apply(recordPromptReducer),
    recordRated: apply(recordRatedReducer),
  };
});
