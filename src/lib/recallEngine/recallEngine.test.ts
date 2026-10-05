import { describe, expect, it } from 'vitest';
import type { Script } from '../../content/scripts';
import { combine, feedbackFor, fillHint, judgeTake, parseChain, parseTake, verdictFor, xpFor } from './index';

const script: Script = {
  firstPass: { 1: '1,2,3', 2: '1,2 > 3', 3: 'slow', 4: '- > -', 5: 'notCaught > idk' },
  laterPass: { 1: '1', 2: '1,2,3' },
};

describe('reading a script', () => {
  it('reads key points, "-" and the special takes', () => {
    expect(parseTake('1, 2')).toEqual({ kind: 'points', points: [1, 2] });
    expect(parseTake('-')).toEqual({ kind: 'points', points: [] });
    expect(parseTake('notCaught')).toEqual({ kind: 'notCaught' });
    expect(parseTake('idk')).toEqual({ kind: 'idk' });
    expect(parseTake('slow')).toEqual({ kind: 'slow' });
  });

  it('reads a chain of takes in order', () => {
    expect(parseChain('1,2 > 3')).toEqual([
      { kind: 'points', points: [1, 2] },
      { kind: 'points', points: [3] },
    ]);
  });
});

describe('the take for a question', () => {
  it('follows the question’s own chain, take by take', () => {
    expect(judgeTake(script, 1, 2, 1)).toEqual({ kind: 'points', points: [1, 2] });
    expect(judgeTake(script, 1, 2, 2)).toEqual({ kind: 'points', points: [3] });
  });

  it('covers nothing new beyond the plan', () => {
    expect(judgeTake(script, 1, 2, 3)).toEqual({ kind: 'points', points: [] });
  });

  it('only reads its own question’s chain', () => {
    expect(judgeTake(script, 1, 1, 2)).toEqual({ kind: 'points', points: [] });
    expect(judgeTake(script, 1, 9, 1)).toEqual({ kind: 'points', points: [] });
  });

  it('uses the later-pass chain after the first pass', () => {
    expect(judgeTake(script, 1, 1, 1)).toEqual({ kind: 'points', points: [1, 2, 3] });
    expect(judgeTake(script, 2, 1, 1)).toEqual({ kind: 'points', points: [1] });
    expect(judgeTake(script, 3, 2, 1)).toEqual({ kind: 'points', points: [1, 2, 3] });
  });

  it('returns the special takes', () => {
    expect(judgeTake(script, 1, 3, 1)).toEqual({ kind: 'slow' });
    expect(judgeTake(script, 1, 5, 1)).toEqual({ kind: 'notCaught' });
    expect(judgeTake(script, 1, 5, 2)).toEqual({ kind: 'idk' });
  });
});

describe('combined coverage and the verdict', () => {
  it('adds each take’s key points to the earlier ones', () => {
    const afterFirst = combine([], { kind: 'points', points: [2, 1] });
    expect(afterFirst).toEqual([1, 2]);
    expect(combine(afterFirst, { kind: 'points', points: [2, 3] })).toEqual([1, 2, 3]);
  });

  it('leaves coverage alone for a take that wasn’t caught', () => {
    expect(combine([1], { kind: 'notCaught' })).toEqual([1]);
    expect(combine([1], { kind: 'slow' })).toEqual([1]);
  });

  it('is correct with every key point, partial with some, wrong with none', () => {
    expect(verdictFor([1, 2, 3], 3)).toBe('correct');
    expect(verdictFor([1, 3], 3)).toBe('partial');
    expect(verdictFor([], 3)).toBe('wrong');
  });

  it('judges takes together: some, then the rest, is correct', () => {
    const covered = combine(combine([], judgeTake(script, 1, 2, 1)), judgeTake(script, 1, 2, 2));
    expect(verdictFor(covered, 3)).toBe('correct');
  });

  it('stays wrong when no take covers anything', () => {
    const covered = combine(combine([], judgeTake(script, 1, 4, 1)), judgeTake(script, 1, 4, 2));
    expect(verdictFor(covered, 3)).toBe('wrong');
  });
});

describe('hints and the nudge', () => {
  it('gives the first uncovered key point’s hint', () => {
    expect(feedbackFor('partial', [1], [], 3)).toEqual({ kind: 'hint', keyPoint: 2 });
    expect(feedbackFor('wrong', [], [], 3)).toEqual({ kind: 'hint', keyPoint: 1 });
  });

  it('moves on to the next unused hint', () => {
    expect(feedbackFor('wrong', [], [1], 3)).toEqual({ kind: 'hint', keyPoint: 2 });
  });

  it('shows the nudge after two hints', () => {
    expect(feedbackFor('wrong', [], [1, 2], 3)).toEqual({ kind: 'nudge' });
  });

  it('shows the nudge when no uncovered key point has a hint left', () => {
    expect(feedbackFor('partial', [1, 2], [3], 3)).toEqual({ kind: 'nudge' });
  });

  it('needs no hint for correct or didn’t-catch-that', () => {
    expect(feedbackFor('correct', [1, 2, 3], [], 3)).toEqual({ kind: 'correct' });
    expect(feedbackFor('notCaught', [], [], 3)).toEqual({ kind: 'notCaught' });
  });

  it('fills in the covered count', () => {
    expect(fillHint('You’ve got {covered} of {total} key ideas.', [1, 2], 3)).toBe('You’ve got 2 of 3 key ideas.');
  });
});

describe('XP', () => {
  it('gives 10 for a first-try correct', () => {
    expect(xpFor({ kind: 'correct', firstTry: true, revealed: false })).toBe(10);
  });

  it('gives 5 for a correct after a hint or retry', () => {
    expect(xpFor({ kind: 'correct', firstTry: false, revealed: false })).toBe(5);
  });

  it('gives 1 once the answer was revealed, even for a correct retry', () => {
    expect(xpFor({ kind: 'correct', firstTry: false, revealed: true })).toBe(1);
  });

  it('gives 1 for needs practice and 0 for a skip', () => {
    expect(xpFor({ kind: 'needsPractice' })).toBe(1);
    expect(xpFor({ kind: 'skipped' })).toBe(0);
  });
});
