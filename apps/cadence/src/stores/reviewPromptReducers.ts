import { addDays } from '../utils/taskUtils';

export interface ReviewPromptState {
  firstSeenDay?: number;
  lastActiveDay?: number;
  activeDays: number;
  completions: number;
  promptedDay?: number;
  promptedVersion?: string;
  rated: boolean;
}

export interface ReviewMoment {
  today: number;
  version: string | null;
  onTime: boolean;
}

export const MIN_DAYS_INSTALLED = 7;
export const MIN_ACTIVE_DAYS = 4;
export const MIN_COMPLETIONS = 10;
export const MIN_DAYS_BETWEEN_PROMPTS = 120;

export const INITIAL_REVIEW_PROMPT_STATE: ReviewPromptState = {
  activeDays: 0,
  completions: 0,
  rated: false,
};

const optionalNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const count = (value: unknown): number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : 0;

export function parseReviewPromptState(raw: unknown): ReviewPromptState {
  if (!raw || typeof raw !== 'object') return INITIAL_REVIEW_PROMPT_STATE;
  const r = raw as Record<string, unknown>;
  return {
    firstSeenDay: optionalNumber(r.firstSeenDay),
    lastActiveDay: optionalNumber(r.lastActiveDay),
    activeDays: count(r.activeDays),
    completions: count(r.completions),
    promptedDay: optionalNumber(r.promptedDay),
    promptedVersion:
      typeof r.promptedVersion === 'string' ? r.promptedVersion : undefined,
    rated: r.rated === true,
  };
}

export function recordActiveDay(
  state: ReviewPromptState,
  today: number
): ReviewPromptState {
  if (state.lastActiveDay === today) return state;
  return {
    ...state,
    firstSeenDay: state.firstSeenDay ?? today,
    lastActiveDay: today,
    activeDays: state.activeDays + 1,
  };
}

export function recordCompletion(state: ReviewPromptState): ReviewPromptState {
  return { ...state, completions: state.completions + 1 };
}

export function recordPrompt(
  state: ReviewPromptState,
  today: number,
  version: string | null
): ReviewPromptState {
  return {
    ...state,
    promptedDay: today,
    promptedVersion: version ?? undefined,
  };
}

export function recordRated(state: ReviewPromptState): ReviewPromptState {
  return state.rated ? state : { ...state, rated: true };
}

export function shouldRequestReview(
  state: ReviewPromptState,
  moment: ReviewMoment
): boolean {
  if (state.rated || !moment.onTime) return false;
  if (state.firstSeenDay === undefined) return false;
  if (addDays(state.firstSeenDay, MIN_DAYS_INSTALLED) > moment.today) {
    return false;
  }
  if (state.activeDays < MIN_ACTIVE_DAYS) return false;
  if (state.completions < MIN_COMPLETIONS) return false;
  if (state.promptedDay === undefined) return true;
  if (moment.version === null || moment.version === state.promptedVersion) {
    return false;
  }
  return addDays(state.promptedDay, MIN_DAYS_BETWEEN_PROMPTS) <= moment.today;
}
