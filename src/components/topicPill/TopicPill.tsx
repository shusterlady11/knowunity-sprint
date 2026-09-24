import './topicPill.css';

export type TopicPillProps = {
  label: string;
};

export function TopicPill({ label }: TopicPillProps) {
  return (
    <span className="topicPill">
      <span className="topicPill__dot" aria-hidden="true" />
      <span className="topicPill__label">{label}</span>
    </span>
  );
}
