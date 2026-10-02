import { questions } from '../../../../content/questions';
import { RecordingScreen } from './RecordingScreen';

// One page per question, 1 to 5; any other number is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((_, i) => ({ n: String(i + 1) }));
}

/** Dictating (SPEC.md › 4): the mic is listening. */
export default async function RecordingPage({ params }: PageProps<'/q/[n]/recording'>) {
  const { n } = await params;
  return <RecordingScreen n={Number(n)} />;
}
