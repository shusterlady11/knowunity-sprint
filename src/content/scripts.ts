// The scripts the moderator picks by entry link (/s/[code]). Each question gets a chain of takes for the
// first pass and one for every later pass. A take lists the key points it covers, takes are separated by
// ">", and the special takes are notCaught, idk and slow (SPEC.md › How the mocked recall behaves › Scripts).
// "-" is a take that covers nothing. The engine that reads these is built with the processing screen.
//
// PLACEHOLDER: the `tour` reference script (SPEC.md › Verification) and one sample participant script, `k7`.
// Real participant scripts come with the real content, with short codes that mean nothing to the student.

export type Chain = Record<number, string>;

export type Script = {
  firstPass: Chain;
  laterPass: Chain;
};

// Reaches every route in one pass: placeholder questions have 3 key points each.
const tourChain: Chain = {
  1: '1,2,3',
  2: '1,2 > 3',
  3: 'slow',
  4: '- > -',
  5: '1,2,3',
};

// After "Review all", every question is answered fully, so a second pass reaches the perfect Results.
const tourLaterChain: Chain = { 1: '1,2,3', 2: '1,2,3', 3: '1,2,3', 4: '1,2,3', 5: '1,2,3' };

// A participant who knows question 1, half-knows question 2, gets question 3 wrong, isn't heard on
// question 4 and knows the rest (2026-10-05). Retries cover nothing new, so 2 and 3 stay partial and wrong.
// "Review all" then answers everything fully.
const k7Chain: Chain = { 1: '1,2,3', 2: '1,2', 3: '-', 4: 'notCaught', 5: '1,2,3' };

export const scripts: Record<string, Script> = {
  tour: { firstPass: tourChain, laterPass: tourLaterChain },
  k7: { firstPass: k7Chain, laterPass: tourLaterChain },
};

/** Used when a session has no script, e.g. one started from the app's home address. */
export const defaultCode = 'tour';
