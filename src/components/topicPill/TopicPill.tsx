import './topicPill.css';

export type TopicPillProps = {
  label: string;
};

/** Names the topic of the current question set, so the student keeps their place. Not for splash screens or navigation. */
export function TopicPill({ label }: TopicPillProps) {
  return (
    <span className="topicPill">
      <span className="topicPill__dot" aria-hidden="true" />
      <span className="topicPill__label">{label}</span>
    </span>
  );
}
