import { LightningIcon } from '../../icons/LightningIcon';
import { IconSlot } from '../iconSlot/IconSlot';
import './xpCounter.css';

export type XpCounterProps = {
  /** Figma's "xp" text property: the student's XP for the session. It says 2 by default. */
  xp?: number | string;
};

/** The student's XP for the session: a lightning bolt and the number. Not a button or a filter. */
export function XpCounter({ xp = 2 }: XpCounterProps) {
  return (
    <span className="xpCounter" role="img" aria-label={`${xp} XP`}>
      <IconSlot size="300">
        <LightningIcon />
      </IconSlot>
      <span className="xpCounter__value">{xp}</span>
    </span>
  );
}
