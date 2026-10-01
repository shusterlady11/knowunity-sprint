// PLACEHOLDER content (D12, decided 2026-10-01): stands in until the designer supplies the real questions
// from what the participants studied. Question 1 is Figma's; the other four are written to fit its topic.
// Key points, hints, feedback and transcripts are added when the screens that use them are built
// (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold, as Figma bolds "Q:" and the key terms.

export type Question = {
  /** The question card's text. */
  prompt: string;
};

export const topic = 'Energy flow in ecosystems';

/** The intro card, shown above question 1 only. */
export const intro = 'Welcome! Let’s test your knowledge on energy flow in ecosystems.';

export const questions: Question[] = [
  { prompt: '**Q:** Can you explain the difference between **producers** and **consumers**, in your own words?' },
  { prompt: '**Q:** Why is **energy lost** at each step up a **food chain**?' },
  { prompt: '**Q:** What role do **decomposers** play in an ecosystem?' },
  { prompt: '**Q:** What’s the difference between a **food chain** and a **food web**?' },
  { prompt: '**Q:** Why are there usually fewer **top predators** than **herbivores**?' },
];
