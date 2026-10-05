'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { ProgressMeter } from '../../components/progressMeter/ProgressMeter';
import { ResultsSummary, type ResultsSummaryProps } from '../../components/resultsSummary/ResultsSummary';
import { BottomCTA } from '../../components/bottomCTA/BottomCTA';
import { questions } from '../../content/questions';
import { resultsCopy } from '../../content/results';
import { rememberRoute, startNextPass, useSession } from '../../lib/session';
import './results.css';

type Category = NonNullable<ResultsSummaryProps['category']>;
type Row = ResultsSummaryProps['rows'][number];

/**
 * Results (SPEC.md › 8): how the latest pass went. The score ring and a headline, then one card per group
 * (good explanations, needs practice, skipped), each row holding that concept's question and every take,
 * joined. No app bar, as in Figma's Results frames.
 */
export default function ResultsPage() {
  const router = useRouter();
  const session = useSession();
  // One row open at a time, across all the cards.
  const [open, setOpen] = useState<{ category: Category; row: number } | null>(null);

  useEffect(() => rememberRoute('/results'), []);

  if (!session) return null;

  // Group each question by how it ended. A question left without an outcome (the student left mid-way)
  // counts as skipped.
  const groups: Record<Category, Row[]> = { 'good-explanations': [], 'needs-practice': [], 'skipped-questions': [] };
  questions.forEach((q, i) => {
    const record = session.questions[i + 1];
    const outcome = record?.outcome ?? 'skipped';
    const category: Category = outcome === 'correct' ? 'good-explanations' : outcome === 'needsPractice' ? 'needs-practice' : 'skipped-questions';
    // Every take, joined. The canned transcripts repeat for takes with the same verdict, so each line shows
    // once, in order; a real engine's takes would all differ.
    const takes = [...new Set(record?.transcripts ?? [])];
    const transcript = takes.length ? takes.join(' ') : undefined;
    groups[category].push({ label: q.answer.title, question: q.prompt.replaceAll('**', ''), transcript });
  });

  const correct = groups['good-explanations'].length;
  const total = questions.length;
  const copy =
    correct === total
      ? resultsCopy.perfect
      : correct > 0
        ? {
            headline: resultsCopy.mixed.headline(correct, total),
            line: resultsCopy.mixed.line(groups['good-explanations'][0].label.toLowerCase()),
          }
        : resultsCopy.noneCorrect;

  // With nothing correct, Figma leads with what was skipped; otherwise good, needs practice, skipped.
  const order: Category[] =
    correct === 0
      ? ['skipped-questions', 'needs-practice', 'good-explanations']
      : ['good-explanations', 'needs-practice', 'skipped-questions'];

  const reviewAll = () => {
    startNextPass();
    router.push('/q/1');
  };

  return (
    <Scaffold
      showTopNavSlot={false}
      middleContent={
        <div className="results__content">
          <div className="results__header">
            {/* Hidden at 0 correct, so the results stay encouraging. */}
            {correct > 0 && <ProgressMeter score={correct as 1 | 2 | 3 | 4 | 5} />}
            <div className="results__title">
              <h1 className="results__headline">{copy.headline}</h1>
              <p className="results__line">{copy.line}</p>
            </div>
          </div>
          <div className="results__cards">
            {order.map((category) => (
              <ResultsSummary
                key={category}
                category={category}
                rows={groups[category]}
                openRow={open?.category === category ? open.row : null}
                onOpenRowChange={(row) => setOpen(row === null ? null : { category, row })}
              />
            ))}
          </div>
        </div>
      }
      bottomContent={
        <div className="results__bar">
          <BottomCTA layout="Two button drawer" leftCTA="Review all" rightCTA="Continue" onLeftClick={reviewAll} onRightClick={() => router.push('/done')} />
        </div>
      }
    />
  );
}
