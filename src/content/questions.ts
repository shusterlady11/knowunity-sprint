// The session's content: AP Biology, Unit 3 (Cellular energetics), five concepts under one topic. Drafted
// 2026-10-07 and approved by the designer (replaces the D12 placeholders). The transcripts are canned:
// participants are told the words shown are placeholders (SPEC.md › How the mocked recall behaves).
//
// Words between ** are shown in bold, as Figma bolds "Q:" and the key terms. Each answer.title is also the
// concept's name in Results, lowercased in "your strongest area is …", so it reads well in lowercase.

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

export const topic = 'Cellular energetics';

/** The intro card, shown above question 1 only. */
export const intro = 'Welcome! Let’s test your knowledge of cellular energetics.';

export const questions: Question[] = [
  {
    prompt: '**Q:** How do **enzymes** speed up chemical reactions in a cell?',
    keyPoints: [
      'They lower the activation energy a reaction needs to start',
      'The substrate binds to the enzyme’s active site, which fits its shape',
      'The enzyme isn’t used up, so it can be used again and again',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about the energy a reaction needs to get started.',
      'You’ve got {covered} of {total} key ideas. Think about where the substrate attaches to the enzyme.',
      'You’ve got {covered} of {total} key ideas. Think about what happens to the enzyme after the reaction.',
    ],
    correct: 'Exactly: enzymes lower the activation energy, and they’re ready to work again right after.',
    answer: {
      title: 'Enzymes',
      heading: 'Lowering the hill',
      body: 'Enzymes are proteins that lower the activation energy of a reaction. The substrate fits into the enzyme’s active site, the reaction happens faster, and the enzyme comes out unchanged, ready to be used again.',
    },
    transcripts: {
      correct: 'Enzymes lower the activation energy. The substrate fits into the active site, and afterwards the enzyme can be used again.',
      partial: 'They lower the activation energy so the reaction happens faster.',
      wrong: 'Enzymes add extra energy to the reaction so it goes faster.',
    },
  },
  {
    prompt: '**Q:** What happens to an **enzyme** when the **temperature** or **pH** goes too far from its ideal range?',
    keyPoints: [
      'Each enzyme works best in an optimal range of temperature and pH',
      'Outside that range, the enzyme denatures: its shape changes',
      'The active site no longer fits the substrate, so the reaction slows or stops',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about the conditions where an enzyme works best.',
      'You’ve got {covered} of {total} key ideas. Think about what heat or acid does to a protein’s shape.',
      'You’ve got {covered} of {total} key ideas. Think about whether the substrate can still bind.',
    ],
    correct: 'You got it: change the shape, and the substrate can’t fit anymore.',
    answer: {
      title: 'Enzyme activity',
      heading: 'Shape is everything',
      body: 'Every enzyme has an optimal temperature and pH. Too far outside them, the enzyme denatures: its shape changes, the active site no longer fits the substrate, and the reaction slows or stops.',
    },
    transcripts: {
      correct: 'Enzymes have an ideal temperature and pH. If it’s too hot or the pH is off, the enzyme denatures and changes shape, so the substrate can’t bind to the active site.',
      partial: 'The enzyme denatures and changes shape.',
      wrong: 'The enzyme just works faster when it’s hotter.',
    },
  },
  {
    prompt: '**Q:** What happens in the **light reactions** and the **Calvin cycle** of photosynthesis?',
    keyPoints: [
      'The light reactions capture light energy and store it in ATP and NADPH',
      'Water is split in the light reactions, releasing oxygen',
      'The Calvin cycle uses that ATP and NADPH to turn carbon dioxide into sugar',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about what the light reactions make from sunlight.',
      'You’ve got {covered} of {total} key ideas. Think about where the oxygen comes from.',
      'You’ve got {covered} of {total} key ideas. Think about what the Calvin cycle builds, and from what.',
    ],
    correct: 'Spot on: light energy goes in, and the Calvin cycle turns it into sugar.',
    answer: {
      title: 'Photosynthesis',
      heading: 'Two stages',
      body: 'In the light reactions, chlorophyll captures light energy and stores it in ATP and NADPH, splitting water and releasing oxygen. In the Calvin cycle, the plant uses that ATP and NADPH to turn carbon dioxide into sugar.',
    },
    transcripts: {
      correct: 'The light reactions use sunlight to make ATP and NADPH and split water, which gives off oxygen. Then the Calvin cycle uses the ATP and NADPH to make sugar from carbon dioxide.',
      partial: 'The light reactions use sunlight to make energy, and the Calvin cycle makes sugar.',
      wrong: 'The Calvin cycle is when the plant breathes in oxygen at night.',
    },
  },
  {
    prompt: '**Q:** Where does a cell make **most of its ATP** during **cellular respiration**, and how?',
    keyPoints: [
      'Most ATP is made in the electron transport chain, in the mitochondria',
      'The chain pumps protons, and their flow back through ATP synthase makes ATP',
      'Oxygen is the final electron acceptor, forming water',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about which stage makes the most ATP.',
      'You’ve got {covered} of {total} key ideas. Think about how ATP synthase is powered.',
      'You’ve got {covered} of {total} key ideas. Think about why the cell needs oxygen.',
    ],
    correct: 'Exactly right: the proton gradient powers ATP synthase, and oxygen keeps the chain moving.',
    answer: {
      title: 'Cellular respiration',
      heading: 'The big payoff',
      body: 'Most ATP is made in the electron transport chain in the mitochondria. Electrons from glucose move down the chain, which pumps protons across the membrane. As they flow back through ATP synthase, it makes ATP. Oxygen takes the electrons at the end, forming water.',
    },
    transcripts: {
      correct: 'In the electron transport chain in the mitochondria. It pumps protons, and they flow back through ATP synthase, which makes ATP. Oxygen takes the electrons at the end and makes water.',
      partial: 'Most of it comes from the electron transport chain in the mitochondria.',
      wrong: 'Most ATP comes from glycolysis, when glucose gets broken in half.',
    },
  },
  {
    prompt: '**Q:** How is **fermentation** different from **aerobic respiration**?',
    keyPoints: [
      'Fermentation happens without oxygen',
      'It recycles NAD+ so glycolysis can keep running',
      'It makes far less ATP: 2 per glucose, instead of about 30',
    ],
    hints: [
      'You’ve got {covered} of {total} key ideas. Think about what fermentation does without.',
      'You’ve got {covered} of {total} key ideas. Think about what keeps glycolysis going.',
      'You’ve got {covered} of {total} key ideas. Think about how much ATP each one makes.',
    ],
    correct: 'You nailed it: no oxygen, NAD+ recycled, and a lot less ATP.',
    answer: {
      title: 'Fermentation',
      heading: 'Plan B for energy',
      body: 'When there’s no oxygen, cells use fermentation. It recycles NAD+ so glycolysis can keep making a little ATP, about 2 per glucose instead of the roughly 30 from aerobic respiration. Its products are lactic acid in muscles, or ethanol and carbon dioxide in yeast.',
    },
    transcripts: {
      correct: 'Fermentation happens without oxygen. It recycles NAD+ so glycolysis keeps going, but it only makes 2 ATP instead of about 30.',
      partial: 'It happens when there’s no oxygen, like in your muscles when you run.',
      wrong: 'Fermentation makes more ATP because it’s faster.',
    },
  },
];
