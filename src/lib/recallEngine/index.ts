// The mocked recall engine (SPEC.md › How the mocked recall behaves › The engine). Given a take, it says
// which key points the take covered, the same shape a real engine (speech recognition + an AI judge) would
// return, so a real one can replace `judgeTake` later without touching the screens. Everything else, the
// verdict and the covered count, is worked out from that.
//
// Hints and XP are added with the result screen.

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
