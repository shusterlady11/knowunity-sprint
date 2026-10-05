import { questions } from '../../../../content/questions';
import { ResultScreen } from './ResultScreen';

// One page per question, 1 to 5; any other number is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((_, i) => ({ n: String(i + 1) }));
}

/** Result (SPEC.md › 7): Knowie's verdict on the latest take, with a hint, the nudge or the answer. */
export default async function ResultPage({ params }: PageProps<'/q/[n]/result'>) {
  const { n } = await params;
  return <ResultScreen n={Number(n)} />;
}
