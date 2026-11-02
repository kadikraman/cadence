import { describe, expect, test } from 'bun:test';
import { addDays } from '../utils/taskUtils';
import {
  INITIAL_REVIEW_PROMPT_STATE,
  MIN_ACTIVE_DAYS,
  MIN_COMPLETIONS,
  MIN_DAYS_BETWEEN_PROMPTS,
  MIN_DAYS_INSTALLED,
  parseReviewPromptState,
  recordActiveDay,
  recordCompletion,
  recordPrompt,
  recordRated,
  ReviewMoment,
  ReviewPromptState,
  shouldRequestReview,
} from './reviewPromptReducers';

const DAY_0 = new Date(2026, 0, 5).getTime();
const READY_DAY = addDays(DAY_0, MIN_DAYS_INSTALLED);

function makeState(
  overrides: Partial<ReviewPromptState> = {}
): ReviewPromptState {
  return {
    firstSeenDay: DAY_0,
    lastActiveDay: READY_DAY,
    activeDays: MIN_ACTIVE_DAYS,
    completions: MIN_COMPLETIONS,
    rated: false,
    ...overrides,
  };
}

function makeMoment(overrides: Partial<ReviewMoment> = {}): ReviewMoment {
  return { today: READY_DAY, version: '1.0.4', onTime: true, ...overrides };
}

describe('parseReviewPromptState', () => {
  test('falls back to the initial state for missing data', () => {
    expect(parseReviewPromptState(null)).toEqual(INITIAL_REVIEW_PROMPT_STATE);
    expect(parseReviewPromptState('x')).toEqual(INITIAL_REVIEW_PROMPT_STATE);
  });

  test('keeps valid fields and drops invalid ones', () => {
    const parsed = parseReviewPromptState({
      firstSeenDay: DAY_0,
      activeDays: 3,
      completions: -2,
      promptedVersion: 7,
      rated: 'yes',
    });
    expect(parsed).toEqual({
      firstSeenDay: DAY_0,
      lastActiveDay: undefined,
      activeDays: 3,
      completions: 0,
      promptedDay: undefined,
      promptedVersion: undefined,
      rated: false,
    });
  });
});

describe('recordActiveDay', () => {
  test('sets the first seen day on the first visit', () => {
    const next = recordActiveDay(INITIAL_REVIEW_PROMPT_STATE, DAY_0);
    expect(next.firstSeenDay).toBe(DAY_0);
    expect(next.lastActiveDay).toBe(DAY_0);
    expect(next.activeDays).toBe(1);
  });

  test('counts each day once', () => {
    const once = recordActiveDay(INITIAL_REVIEW_PROMPT_STATE, DAY_0);
    expect(recordActiveDay(once, DAY_0)).toBe(once);
  });

  test('keeps the first seen day on later days', () => {
    const once = recordActiveDay(INITIAL_REVIEW_PROMPT_STATE, DAY_0);
    const twice = recordActiveDay(once, addDays(DAY_0, 1));
    expect(twice.firstSeenDay).toBe(DAY_0);
    expect(twice.activeDays).toBe(2);
  });
});

describe('recordCompletion', () => {
  test('adds one completion', () => {
    expect(recordCompletion(makeState({ completions: 2 })).completions).toBe(3);
  });
});

describe('recordPrompt', () => {
  test('stores the day and version', () => {
    const next = recordPrompt(makeState(), READY_DAY, '1.0.4');
    expect(next.promptedDay).toBe(READY_DAY);
    expect(next.promptedVersion).toBe('1.0.4');
  });
});

describe('recordRated', () => {
  test('marks the app as rated once', () => {
    const rated = recordRated(makeState());
    expect(rated.rated).toBe(true);
    expect(recordRated(rated)).toBe(rated);
  });
});

describe('shouldRequestReview', () => {
  test('asks when every threshold is met', () => {
    expect(shouldRequestReview(makeState(), makeMoment())).toBe(true);
  });

  test('does not ask for a late completion', () => {
    expect(
      shouldRequestReview(makeState(), makeMoment({ onTime: false }))
    ).toBe(false);
  });

  test('does not ask after the user opened the store from Settings', () => {
    expect(shouldRequestReview(makeState({ rated: true }), makeMoment())).toBe(
      false
    );
  });

  test('does not ask before the install is old enough', () => {
    expect(
      shouldRequestReview(
        makeState(),
        makeMoment({ today: addDays(READY_DAY, -1) })
      )
    ).toBe(false);
    expect(
      shouldRequestReview(makeState({ firstSeenDay: undefined }), makeMoment())
    ).toBe(false);
  });

  test('does not ask with too few active days', () => {
    expect(
      shouldRequestReview(
        makeState({ activeDays: MIN_ACTIVE_DAYS - 1 }),
        makeMoment()
      )
    ).toBe(false);
  });

  test('does not ask with too few completions', () => {
    expect(
      shouldRequestReview(
        makeState({ completions: MIN_COMPLETIONS - 1 }),
        makeMoment()
      )
    ).toBe(false);
  });

  describe('after an earlier prompt', () => {
    const prompted = makeState({
      promptedDay: READY_DAY,
      promptedVersion: '1.0.4',
    });
    const later = addDays(READY_DAY, MIN_DAYS_BETWEEN_PROMPTS);

    test('asks again on a new version after the wait', () => {
      expect(
        shouldRequestReview(
          prompted,
          makeMoment({ today: later, version: '1.1.0' })
        )
      ).toBe(true);
    });

    test('does not ask again on the same version', () => {
      expect(
        shouldRequestReview(
          prompted,
          makeMoment({ today: later, version: '1.0.4' })
        )
      ).toBe(false);
    });

    test('does not ask again before the wait ends', () => {
      expect(
        shouldRequestReview(
          prompted,
          makeMoment({ today: addDays(later, -1), version: '1.1.0' })
        )
      ).toBe(false);
    });

    test('does not ask again when the version is unknown', () => {
      expect(
        shouldRequestReview(
          prompted,
          makeMoment({ today: later, version: null })
        )
      ).toBe(false);
    });
  });
});
