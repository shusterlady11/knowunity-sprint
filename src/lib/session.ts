'use client';

// The saved session (SPEC.md › How the mocked recall behaves › Storage), kept on the phone so reopening the
// app resumes where the student was. /reset clears it, and the "splash seen" flag, between participants.
// Storage can be unavailable (private mode, blocked data), so every read and write is guarded and the app
// still works, just without resuming.

import { useMemo, useSyncExternalStore } from 'react';

export type InputMode = 'voice' | 'keyboard';

export type QuestionRecord = {
  /** How many takes the student has submitted for this question, this pass. */
  takes: number;
  /** Set when the student skipped the question. Verdicts are added with the result screen. */
  outcome?: 'skipped';
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
};

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
