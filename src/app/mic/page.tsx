'use client';

import { useRouter } from 'next/navigation';
import { Scaffold } from '../../components/scaffold/Scaffold';
import { AppBar } from '../../components/appBar/AppBar';
import { TopicPill } from '../../components/topicPill/TopicPill';
import { MascotSlot } from '../../components/mascotSlot/MascotSlot';
import { AnswerCard } from '../../components/answerCard/AnswerCard';
import { TapToAnswer } from '../../components/tapToAnswer/TapToAnswer';
import { MicButton } from '../../components/micButton/MicButton';
import { BottomSheet } from '../../components/bottomSheet/BottomSheet';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { Button } from '../../components/button/Button';
import './mic.css';

/** Mic primer (SPEC.md › 2): a sheet asking to turn on the mic, over question 1 behind a scrim. */
export default function MicPage() {
  const router = useRouter();

  // The question screen behind the sheet, as in Figma's PERMISSION-MIC. It's a static picture until the
  // question screen exists (docs/open-items.md, Known limits), and `inert` keeps taps and screen readers
  // in the sheet: the scrim already blocks taps, but not a screen reader.
  return (
    <Scaffold
      topNavigation={
        <div inert>
          <AppBar progress={0} xp={0} />
        </div>
      }
      middleContent={
        <div className="mic__question" inert>
          <TopicPill label="Energy flow in ecosystems" />
          <div className="mic__speaker">
            <MascotSlot size="2XL" expression="standby" />
            <div className="mic__card">
              <AnswerCard
                state="question"
                message={
                  <>
                    <strong>Q:</strong> Can you explain the difference between <strong>producers</strong> and{' '}
                    <strong>consumers</strong>, in your own words?
                  </>
                }
              />
            </div>
          </div>
        </div>
      }
      bottomContent={
        <div className="mic__answer" inert>
          <TapToAnswer text="Tap to dictate" />
          <MicButton />
        </div>
      }
      showBottomSheetBackground
      bottomSheetOnly={
        <BottomSheet
          appBar={{ type: 'Default' }}
          label="Turn on your microphone"
          middleSection={
            <>
              <MascotSlot size="3XL" expression="approving" />
              {/* Built here: no TextBlock size uses Headline S, Figma's style for this line (docs/component-gaps.md). */}
              <p className="mic__primerText">Turn on your microphone settings to start practicing.</p>
            </>
          }
          bottomSection={
            <div className="mic__actions">
              <ButtonGroup variant="Vertical" size="L">
                {/* No browser prompt: the mic is mocked (docs/sprint-context.md). Voice is the question screen's default mode. */}
                <Button variant="Primary" size="L" CTA="Turn on" onClick={() => router.push('/q/1')} />
                <Button variant="Secondary" size="L" CTA="Not now" onClick={() => router.push('/mic-off')} />
              </ButtonGroup>
            </div>
          }
        />
      }
    />
  );
}
