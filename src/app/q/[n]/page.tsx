import { questions } from '../../../content/questions';
import { QuestionScreen } from './QuestionScreen';

// One page per question, 1 to 5; any other number is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((_, i) => ({ n: String(i + 1) }));
}

/** Question (SPEC.md › 3): ready to answer by voice. */
export default async function QuestionPage({ params }: PageProps<'/q/[n]'>) {
  const { n } = await params;
  return <QuestionScreen n={Number(n)} />;
}
