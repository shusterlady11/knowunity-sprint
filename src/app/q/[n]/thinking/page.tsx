import { questions } from '../../../../content/questions';
import { ThinkingScreen } from './ThinkingScreen';

// One page per question, 1 to 5; any other number is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((_, i) => ({ n: String(i + 1) }));
}

/** Processing (SPEC.md › 6): Knowie judges the take, then the screen moves on by itself. */
export default async function ThinkingPage({ params }: PageProps<'/q/[n]/thinking'>) {
  const { n } = await params;
  return <ThinkingScreen n={Number(n)} />;
}
