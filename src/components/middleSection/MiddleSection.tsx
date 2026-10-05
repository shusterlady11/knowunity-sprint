import { useState, type ReactNode } from 'react';
import { AnswerCard } from '../answerCard/AnswerCard';
import { MascotSlot } from '../mascotSlot/MascotSlot';
import { TopicPill } from '../topicPill/TopicPill';
import './middleSection.css';

export type MiddleSectionProps = {
  /** The topic pill's text: Figma's nested topicPill "Label". */
  topic: string;
  /** The question card's text (answerCard, state=question). Key words can be wrapped in `<strong>`. */
  question: ReactNode;
  /** The intro card's text (answerCard, state=Default), above the question. */
  intro?: ReactNode;
  /**
   * Show the intro card. Figma has no property for this and always draws it; code adds one. Turned off
   * after it was shown, the card fades out while its space collapses, so the question card slides up.
   */
  showIntro?: boolean;
};

/** The top of a question screen: the topic pill, then Knowie peeking out from behind the intro and question cards. */
export function MiddleSection({ topic, question, intro, showIntro = true }: MiddleSectionProps) {
  // Once shown, the intro card stays in the page so it can animate out; one that was never shown isn't drawn.
  const [introDrawn, setIntroDrawn] = useState(showIntro);
  if (showIntro && !introDrawn) setIntroDrawn(true);

  return (
    <div className="middleSection">
      <TopicPill label={topic} />
      <div className="middleSection__conversation">
        <div className="middleSection__mascot">
          <MascotSlot size="2XL" expression="standby" />
        </div>
        {introDrawn && (
          <div className="middleSection__intro" data-hidden={!showIntro || undefined} aria-hidden={!showIntro || undefined} inert={!showIntro}>
            <div className="middleSection__introInner">
              <div className="middleSection__introCard">
                <AnswerCard state="Default" message={intro} />
              </div>
            </div>
          </div>
        )}
        <AnswerCard state="question" message={question} />
      </div>
    </div>
  );
}
