import Image from 'next/image';
import './mascotSlot.css';

// Figma's slot sizes, largest first in use: XL is the smallest and shouldn't be a hero (see the story docs).
export type MascotSlotSize = 'XL' | '2XL' | '3XL' | '4XL';

// The twelve Knowie expressions shipped in public/images (nine SVGs and three PNGs).
export type MascotExpression =
  | 'amazed'
  | 'angry'
  | 'approving'
  | 'confused'
  | 'determined'
  | 'excited'
  | 'giggling'
  | 'laughing'
  | 'over-it'
  | 'sad'
  | 'standby'
  | 'thinking';

export type MascotSlotProps = {
  size?: MascotSlotSize;
  /** Which Knowie expression to show. Figma's slot has no property for this (its base has a "Homie" swap that the slot doesn't expose), so code adds one. Standby by default, as in Figma. */
  expression?: MascotExpression;
  /** A description for screen readers. Empty by default: the mascot is decoration, and the text on screen carries the meaning. */
  alt?: string;
};

const pngExpressions: ReadonlySet<MascotExpression> = new Set(['determined', 'sad', 'thinking']);

/** A square that holds the Knowie mascot at one of four large sizes, with the art inset by Space/300. */
export function MascotSlot({ size = 'XL', expression = 'standby', alt = '' }: MascotSlotProps) {
  const extension = pngExpressions.has(expression) ? 'png' : 'svg';

  return (
    <span className="mascotSlot" data-size={size} data-expression={expression}>
      <span className="mascotSlot__art">
        <Image
          className="mascotSlot__image"
          src={`/images/${expression}.${extension}`}
          alt={alt}
          fill
          sizes="320px"
          unoptimized
        />
      </span>
    </span>
  );
}
