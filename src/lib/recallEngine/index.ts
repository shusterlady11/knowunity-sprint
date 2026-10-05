// The mocked recall engine (SPEC.md › How the mocked recall behaves › The engine). Given a take, it says
// which key points the take covered, the same shape a real engine (speech recognition + an AI judge) would
// return, so a real one can replace `judgeTake` later without touching the screens. Everything else, the
// verdict, the covered count, the hint and XP, is worked out from that.

import type { Script } from '../../content/scripts';

/** What one take turned out to be. */
export type Take =
  | { kind: 'points'; points: number[] }
  | { kind: 'notCaught' }
  | { kind: 'idk' }
  | { kind: 'slow' };

export type Verdict = 'correct' | 'partial' | 'wrong' | 'notCaught';

const nothing: Take = { kind: 'points', points: [] };

/** Reads one take from a script chain: "1,2", "-" (covers nothing), "notCaught", "idk" or "slow". */
export function parseTake(text: string): Take {
  const t = text.trim();
  if (t === 'notCaught' || t === 'idk' || t === 'slow') return { kind: t };
  if (t === '-' || t === '') return nothing;
  return { kind: 'points', points: t.split(',').map((p) => Number(p.trim())) };
}

/** Reads a whole chain: takes separated by ">". */
export function parseChain(chain: string): Take[] {
  return chain.split('>').map(parseTake);
}

/**
 * The script's take for a question. `takeNumber` counts from 1. Pass 1 uses the first-pass chain, later
 * passes the later-pass chain. A take beyond the plan covers nothing new.
 */
export function judgeTake(script: Script, pass: number, question: number, takeNumber: number): Take {
  const chain = (pass === 1 ? script.firstPass : script.laterPass)[question];
  if (!chain) return nothing;
  return parseChain(chain)[takeNumber - 1] ?? nothing;
}

/** Key points covered so far on a question, adding this take's to the earlier ones. Sorted, no repeats. */
export function combine(covered: number[], take: Take): number[] {
  if (take.kind !== 'points') return covered;
  return [...new Set([...covered, ...take.points])].sort((a, b) => a - b);
}

/** The verdict from combined coverage: all key points correct, some partial, none wrong. */
export function verdictFor(covered: number[], keyPointCount: number): Verdict {
  if (covered.length >= keyPointCount) return 'correct';
  return covered.length > 0 ? 'partial' : 'wrong';
}

/** What the result card says, chosen when the take is judged. */
export type Feedback =
  | { kind: 'correct' }
  | { kind: 'hint'; keyPoint: number }
  | { kind: 'nudge' }
  | { kind: 'notCaught' };

/** After this many hints, a partial or wrong shows the nudge toward Reveal answer instead (SPEC.md › 7). */
export const hintLimit = 2;

/**
 * The card's feedback for a verdict. A partial or wrong gets the next unused hint, in key-point order,
 * for a key point the student hasn't covered yet; after `hintLimit` hints, or when none is left, the nudge.
 */
export function feedbackFor(verdict: Verdict, covered: number[], hintsUsed: number[], keyPointCount: number): Feedback {
  if (verdict === 'correct') return { kind: 'correct' };
  if (verdict === 'notCaught') return { kind: 'notCaught' };
  if (hintsUsed.length >= hintLimit) return { kind: 'nudge' };
  for (let keyPoint = 1; keyPoint <= keyPointCount; keyPoint++) {
    if (!covered.includes(keyPoint) && !hintsUsed.includes(keyPoint)) return { kind: 'hint', keyPoint };
  }
  return { kind: 'nudge' };
}

/** Fills a hint's {covered} and {total} with the covered count. */
export function fillHint(hint: string, covered: number[], keyPointCount: number): string {
  return hint.replace('{covered}', String(covered.length)).replace('{total}', String(keyPointCount));
}

/** XP for how a question ended (SPEC.md › How the mocked recall behaves › XP). */
export function xpFor(outcome: { kind: 'correct'; firstTry: boolean; revealed: boolean } | { kind: 'needsPractice' } | { kind: 'skipped' }): number {
  if (outcome.kind === 'skipped') return 0;
  if (outcome.kind === 'needsPractice') return 1;
  if (outcome.revealed) return 1;
  return outcome.firstTry ? 10 : 5;
}
