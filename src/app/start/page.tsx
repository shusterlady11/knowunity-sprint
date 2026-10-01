'use client';

import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { ButtonIcon } from '../../components/buttonIcon/ButtonIcon';
import { TextBlock } from '../../components/textBlock/TextBlock';
import { MascotSlot } from '../../components/mascotSlot/MascotSlot';
import { AnswerCard } from '../../components/answerCard/AnswerCard';
import { Button } from '../../components/button/Button';
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon';
import './start.css';

/** First-run splash (SPEC.md › 1): Knowie explains why answering out loud helps, then the mic primer. */
export default function StartPage() {
  const router = useRouter();

  return (
    <Scaffold
      topNavigation={
        // Built here: AppBar always draws progress and XP, and this bar has only a back button
        // (docs/component-gaps.md). It leaves the test, standing in for the launching screen.
        <nav className="start__topBar">
          <ButtonIcon
            variant="Tertiary"
            size="L"
            icon={<ArrowLeftIcon />}
            aria-label="Back"
            onClick={() => router.push('/done')}
          />
        </nav>
      }
      middleContent={
        <div className="start__content">
          {/* TextBlock doesn't choose a heading level, so the screen marks its title as the page heading. */}
          <div role="heading" aria-level={1} className="start__heading">
            <TextBlock variant="L" showCaption={false} title="Now, let’s build some muscle memory." />
          </div>
          <div className="start__speaker">
            <div className="start__mascot">
              <MascotSlot size="2XL" expression="standby" />
            </div>
            <div className="start__bubble">
              {/* Built here: AnswerCard has no tail (docs/component-gaps.md). Decoration only. */}
              <svg className="start__tail" viewBox="0 0 19 16" fill="none" aria-hidden="true">
                <path
                  d="M16.5184 0.482086C9.18766 3.40762 3.409 9.8524 0.579547 13.9885C0.141836 14.6283 0.614526 15.4644 1.38976 15.4644H12.1183C12.99 15.4644 13.5333 14.3285 13.2969 13.4894C12.3246 10.038 14.939 5.37767 17.5367 2.02372C18.1464 1.23648 17.4432 0.113012 16.5184 0.482086Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.818417"
                  strokeLinecap="round"
                />
              </svg>
              <AnswerCard
                state="Default"
                message="When you can explain a concept to someone else, not only do you strengthen your memory, but you will score higher on your tests!"
              />
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="start__actions">
          <Button variant="Primary" size="L" CTA="Let’s go!" onClick={() => router.push('/mic')} />
        </div>
      }
    />
  );
}
