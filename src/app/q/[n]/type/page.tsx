import { questions } from '../../../../content/questions';
import { TypeScreen } from './TypeScreen';

// One page per question, 1 to 5; any other number is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map((_, i) => ({ n: String(i + 1) }));
}

/**
 * Typing (SPEC.md › 10): answering by keyboard. `?focus` opens it ready to type, with the field focused, as
 * when the student taps the typing bar on a result.
 */
export default async function TypePage({ params, searchParams }: PageProps<'/q/[n]/type'>) {
  const { n } = await params;
  const { focus } = await searchParams;
  return <TypeScreen n={Number(n)} startTyping={focus !== undefined} />;
}
