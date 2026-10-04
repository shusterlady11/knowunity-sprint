// The scripts the moderator picks by entry link (/s/[code]). Each question gets a chain of takes for the
// first pass and one for every later pass. A take lists the key points it covers, takes are separated by
// ">", and the special takes are notCaught, idk and slow (SPEC.md › How the mocked recall behaves › Scripts).
// "-" is a take that covers nothing. The engine that reads these is built with the processing screen.
//
// PLACEHOLDER: only the `tour` reference script exists (SPEC.md › Verification). Participant scripts come
// with the real content, and their codes should be short and meaningless to the student (e.g. k7).

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

export const scripts: Record<string, Script> = {
  tour: { firstPass: tourChain, laterPass: tourChain },
};

/** Used when a session has no script, e.g. one started from the app's home address. */
export const defaultCode = 'tour';
