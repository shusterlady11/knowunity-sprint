import './tapToAnswer.css';

export type TapToAnswerProps = {
  /** Figma's "Text": the hint. It says "Tap to answer" by default. */
  text?: string;
};

/** A small, dimmed hint line that tells the student how to answer. It's plain text, not a button. */
export function TapToAnswer({ text = 'Tap to answer' }: TapToAnswerProps) {
  return <p className="tapToAnswer">{text}</p>;
}
