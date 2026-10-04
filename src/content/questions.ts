// PLACEHOLDER content (D12, decided 2026-10-01): stands in until the designer supplies the real questions
// from what the participants studied. Question 1 is Figma's; the other four are written to fit its topic.
// The key points are placeholders too. Hints, feedback and transcripts are added when the screens that use
// them are built (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold, as Figma bolds "Q:" and the key terms.

export type Question = {
  /** The question card's text. */
  prompt: string;
  /** The 2–4 ideas a good answer covers. Scripts refer to them by number, from 1. */
  keyPoints: string[];
};

export const topic = 'Energy flow in ecosystems';

/** The intro card, shown above question 1 only. */
export const intro = 'Welcome! Let’s test your knowledge on energy flow in ecosystems.';

export const questions: Question[] = [
  {
    prompt: '**Q:** Can you explain the difference between **producers** and **consumers**, in your own words?',
    keyPoints: [
      'Producers make their own food from sunlight',
      'Consumers eat other living things for energy',
      'Consumers depend on producers, directly or indirectly',
    ],
  },
  {
    prompt: '**Q:** Why is **energy lost** at each step up a **food chain**?',
    keyPoints: [
      'Organisms use most energy to live (moving, keeping warm)',
      'Much energy leaves as heat',
      'Only about a tenth passes to the next level',
    ],
  },
  {
    prompt: '**Q:** What role do **decomposers** play in an ecosystem?',
    keyPoints: [
      'Decomposers break down dead plants and animals',
      'They return nutrients to the soil',
      'Producers reuse those nutrients to grow',
    ],
  },
  {
    prompt: '**Q:** What’s the difference between a **food chain** and a **food web**?',
    keyPoints: [
      'A food chain shows one path of energy',
      'A food web shows many connected chains',
      'Most animals eat, and are eaten by, more than one thing',
    ],
  },
  {
    prompt: '**Q:** Why are there usually fewer **top predators** than **herbivores**?',
    keyPoints: [
      'Energy shrinks at each step up',
      'Top predators need lots of prey to get enough energy',
      'So fewer of them can be supported',
    ],
  },
];
