// PLACEHOLDER content (D12, decided 2026-10-01): stands in until the designer supplies the real questions
// from what the participants studied. Question 1 is Figma's; the other four are written to fit its topic.
// The key points, hints, correct lines, answers and transcripts are placeholders too; question 1's correct
// line and answer are Figma's (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold, as Figma bolds "Q:" and the key terms.

export type Question = {
  /** The question card's text. */
  prompt: string;
  /** The 2–4 ideas a good answer covers. Scripts refer to them by number, from 1. */
  keyPoints: string[];
  /**
   * One hint per key point, in the same order. {covered} and {total} are filled in with the covered count,
   * e.g. "You've got 2 of 3 key ideas".
   */
  hints: string[];
  /** Knowie's line on a correct answer. */
  correct: string;
  /**
   * The Reveal answer and More info sheet: the concept's name in the sheet's bar, a short heading, then the
   * answer and context.
   */
  answer: { title: string; heading: string; body: string };
  /**
   * What the student "said", canned for each kind of take (participants are told the words are
   * placeholders). Shown only in the Results rows, every take joined.
   */
  transcripts: { correct: string; partial: string; wrong: string };
};

/** The transcript for an "I don't know" take. */
export const idkTranscript = 'I don’t know.';

/** The card's text after both hints are used, the same for every question (SPEC.md › 7). */
export const nudge = 'You’re close. Want to see the full answer?';

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
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about where producers get their energy.',
      'You’ve got {covered} of {total} key ideas. Think about what consumers have to do to get energy.',
      'You’ve got {covered} of {total} key ideas. Think about what consumers would do without producers.',
    ],
    correct: 'You nailed it with the producers providing a food source for the consumers.',
    answer: {
      title: 'Producers and consumers',
      heading: 'Web of life',
      body: 'Producers make their own food, while consumers get energy by eating producers or other consumers.',
    },
    transcripts: {
      correct: 'Producers make their own food from sunlight, and consumers eat other things to get energy, so they depend on producers.',
      partial: 'Producers make their own food and consumers eat other living things.',
      wrong: 'Producers are the animals that make the most food in an ecosystem.',
    },
  },
  {
    prompt: '**Q:** Why is **energy lost** at each step up a **food chain**?',
    keyPoints: [
      'Organisms use most energy to live (moving, keeping warm)',
      'Much energy leaves as heat',
      'Only about a tenth passes to the next level',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about what living things spend energy on.',
      'You’ve got {covered} of {total} key ideas. Think about what happens to energy as heat.',
      'You’ve got {covered} of {total} key ideas. Think about how much energy reaches the next level.',
    ],
    correct: 'Exactly: most energy is used up or lost as heat, so only a little moves up.',
    answer: {
      title: 'Energy loss',
      heading: 'The 10% rule',
      body: 'Organisms use most of their energy to live, and much of it leaves as heat. Only about a tenth passes to the next level.',
    },
    transcripts: {
      correct: 'Living things use most of their energy just to live, a lot is lost as heat, and only about a tenth moves up.',
      partial: 'A lot of the energy is used up moving around and keeping warm.',
      wrong: 'The energy gets eaten by the predators at the top.',
    },
  },
  {
    prompt: '**Q:** What role do **decomposers** play in an ecosystem?',
    keyPoints: [
      'Decomposers break down dead plants and animals',
      'They return nutrients to the soil',
      'Producers reuse those nutrients to grow',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about what happens to dead plants and animals.',
      'You’ve got {covered} of {total} key ideas. Think about where the nutrients end up.',
      'You’ve got {covered} of {total} key ideas. Think about who uses those nutrients next.',
    ],
    correct: 'Spot on: decomposers close the loop by returning nutrients to the soil.',
    answer: {
      title: 'Decomposers',
      heading: 'Nature’s recyclers',
      body: 'Decomposers break down dead plants and animals and return their nutrients to the soil, where producers use them to grow.',
    },
    transcripts: {
      correct: 'Decomposers break down dead things and put the nutrients back in the soil for plants to use.',
      partial: 'They break down dead plants and animals.',
      wrong: 'Decomposers are the biggest predators in the food chain.',
    },
  },
  {
    prompt: '**Q:** What’s the difference between a **food chain** and a **food web**?',
    keyPoints: [
      'A food chain shows one path of energy',
      'A food web shows many connected chains',
      'Most animals eat, and are eaten by, more than one thing',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about how many paths a food chain shows.',
      'You’ve got {covered} of {total} key ideas. Think about how chains connect to each other.',
      'You’ve got {covered} of {total} key ideas. Think about how many things most animals eat.',
    ],
    correct: 'Right: a web is many chains linked together, like real ecosystems.',
    answer: {
      title: 'Chains and webs',
      heading: 'One path or many',
      body: 'A food chain shows one path of energy. A food web shows many connected chains, since most animals eat, and are eaten by, more than one thing.',
    },
    transcripts: {
      correct: 'A food chain is one path of energy, but a food web connects lots of chains because animals eat many things.',
      partial: 'A food chain is just one line of who eats who.',
      wrong: 'A food web is a longer food chain.',
    },
  },
  {
    prompt: '**Q:** Why are there usually fewer **top predators** than **herbivores**?',
    keyPoints: [
      'Energy shrinks at each step up',
      'Top predators need lots of prey to get enough energy',
      'So fewer of them can be supported',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about how energy changes at each step up.',
      'You’ve got {covered} of {total} key ideas. Think about how much prey a top predator needs.',
      'You’ve got {covered} of {total} key ideas. Think about how many predators that can support.',
    ],
    correct: 'You got it: with less energy at the top, an ecosystem can only support a few top predators.',
    answer: {
      title: 'Top predators',
      heading: 'Energy at the top',
      body: 'Energy shrinks at each step up a food chain, so top predators need lots of prey to get enough. That means fewer of them can be supported.',
    },
    transcripts: {
      correct: 'Energy gets smaller at each level, so top predators need lots of prey and there can only be a few of them.',
      partial: 'There’s less energy as you go up the food chain.',
      wrong: 'Top predators are bigger, so there’s less room for them.',
    },
  },
];
