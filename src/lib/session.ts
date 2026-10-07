'use client';

// The saved session (SPEC.md › How the mocked recall behaves › Storage), kept on the phone so reopening the
// app resumes where the student was. /reset clears it, and the "splash seen" flag, between participants.
// Storage can be unavailable (private mode, blocked data), so every read and write is guarded and the app
// still works, just without resuming.

import { useMemo, useSyncExternalStore } from 'react';
import { xpFor, type Feedback, type Verdict } from './recallEngine';

export type InputMode = 'voice' | 'keyboard';

export type QuestionRecord = {
  /** How many takes have been judged for this question, this pass. */
  takes: number;
  /** Key points covered by all this question's takes so far, this pass. */
  covered?: number[];
  /** The latest take's verdict, for the result screen. */
  verdict?: Verdict;
  /** What the result card says for the latest take, chosen when it was judged. */
  feedback?: Feedback;
  /** Key points whose hints the student has seen, in order. */
  hintsUsed?: number[];
  /** What the student said, one entry per take, in order (for the Results rows). */
  transcripts?: string[];
  /** A typed take on its way to be judged: exactly what the student typed, used as its transcript. */
  typed?: string;
  /** Set once the student has opened Reveal answer. */
  revealed?: boolean;
  /**
   * How the question ended, for Results: correct (any attempt, never revealed), needs practice (Next after
   * a partial or wrong, or the answer was revealed) or skipped. Set once, along with its XP.
   */
  outcome?: 'correct' | 'needsPractice' | 'skipped';
};

export type Session = {
  /** The script code from the entry link /s/[code]. */
  code: string;
  /** Where to resume. Never a recording or thinking route: those resume on their question. */
  route: string;
  inputMode: InputMode;
  /** 1 on the first pass; "Review all" starts the next. */
  pass: number;
  xp: number;
  /** Keyed by question number, 1 to 5, for the current pass. */
  questions: Record<number, QuestionRecord>;
  /** Set once the student starts answering question 1 for the first time; the "Welcome!" card never shows again. */
  introSeen?: boolean;
  /** How the student reached the end screen, saved by the button that leads there (was D3). */
  endedBy?: EndedBy;
};

export type EndedBy = 'finished' | 'left' | 'optedOut';

const SESSION_KEY = 'knowie.session';
const SPLASH_KEY = 'knowie.splashSeen';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// Screens that show saved values (XP) subscribe, so they update when the session changes.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the session just won't resume.
  }
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function rawSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

/** The saved session, for showing saved values. Null on the server and before anything is saved. */
export function useSession(): Session | null {
  const raw = useSyncExternalStore(subscribe, rawSession, () => null);
  return useMemo(() => (raw ? (JSON.parse(raw) as Session) : null), [raw]);
}

export function getSession(): Session | null {
  return read<Session>(SESSION_KEY);
}

/** Starts a new session for a script code, at the given route. */
export function startSession(code: string, route: string): Session {
  const session: Session = { code, route, inputMode: 'voice', pass: 1, xp: 0, questions: {} };
  write(SESSION_KEY, session);
  return session;
}

/** Changes the saved session. Does nothing when there's no session yet. */
export function updateSession(change: (session: Session) => void) {
  const session = getSession();
  if (!session) return;
  change(session);
  write(SESSION_KEY, session);
}

/** Remembers where the student is. A recording or thinking route resumes on its question, dropping the take. */
export function rememberRoute(pathname: string) {
  const route = pathname.replace(/\/(recording|thinking)$/, '');
  updateSession((session) => {
    session.route = route;
  });
}

/**
 * Where question n opens in the current input mode: the typing screen in keyboard mode, the question screen
 * otherwise. Going straight there avoids the question screen showing the mic for a moment before it sends a
 * keyboard-mode student on to typing.
 */
export function questionRoute(n: number): string {
  return getSession()?.inputMode === 'keyboard' ? `/q/${n}/type` : `/q/${n}`;
}

/**
 * Ends question n with the outcome the student chose, once, adding its XP. A skip after the answer was
 * revealed counts as needs practice (1 XP), since any concept whose answer was revealed goes there (decided
 * 2026-10-06). Used by every Skip and Next that ends a question without a correct answer.
 */
export function endQuestion(session: Session, n: number, outcome: 'needsPractice' | 'skipped') {
  const record = questionRecord(session, n);
  if (record.outcome) return;
  record.outcome = record.revealed ? 'needsPractice' : outcome;
  session.xp += xpFor({ kind: record.outcome });
}

/** The record for one question, created when first needed. */
export function questionRecord(session: Session, n: number): QuestionRecord {
  session.questions[n] ??= { takes: 0 };
  return session.questions[n];
}

export function hasSeenSplash(): boolean {
  return read<boolean>(SPLASH_KEY) === true;
}

export function markSplashSeen() {
  write(SPLASH_KEY, true);
}

/**
 * Saves how the session ended, for the end screen's message. Finishing or opting out ends the session, so
 * reopening the app comes back to the end screen; a student who left keeps their place and resumes there
 * ("Progress saved. Come back any time.").
 */
export function endSession(endedBy: EndedBy) {
  updateSession((session) => {
    session.endedBy = endedBy;
    if (endedBy !== 'left') session.route = '/done';
  });
}

/**
 * "Review all" on Results: a new pass of all the questions, in voice mode from question 1. XP carries over;
 * the questions start fresh, so Results show only the latest pass (SPEC.md › 8).
 */
export function startNextPass() {
  updateSession((session) => {
    session.pass += 1;
    session.questions = {};
    session.inputMode = 'voice';
    session.route = '/q/1';
  });
}

/** Clears the session and the "splash seen" flag (/reset). */
export function clearAll() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SPLASH_KEY);
  } catch {
    // Nothing stored to clear.
  }
  notify();
}
