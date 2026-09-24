import type { MouseEventHandler } from 'react';
import { Button } from '../button/Button';
import type { ButtonVariant } from '../button/Button';
import './bottomCTA.css';

export type BottomCTALayout =
  | 'Two button no drawer'
  | 'Two button drawer'
  | 'One button drawer / primary'
  | 'One button drawer / secondary'
  | 'Two button drawer / Secondary';

export type BottomCTAProps = {
  layout?: BottomCTALayout;
  showSecondaryButton?: boolean;
  leftCTA?: string;
  rightCTA: string;
  onLeftClick?: MouseEventHandler<HTMLButtonElement>;
  onRightClick?: MouseEventHandler<HTMLButtonElement>;
};

// Which button kind sits on each side, per the Figma variants. One-button layouts have no left button.
const buttonsFor: Record<BottomCTALayout, { left: ButtonVariant | null; right: ButtonVariant }> = {
  'Two button no drawer': { left: 'Secondary', right: 'Primary' },
  'Two button drawer': { left: 'Secondary', right: 'Primary' },
  'Two button drawer / Secondary': { left: 'Tertiary', right: 'Secondary' },
  'One button drawer / primary': { left: null, right: 'Primary' },
  'One button drawer / secondary': { left: null, right: 'Secondary' },
};

export function BottomCTA({
  layout = 'Two button no drawer',
  showSecondaryButton = true,
  leftCTA,
  rightCTA,
  onLeftClick,
  onRightClick,
}: BottomCTAProps) {
  const { left, right } = buttonsFor[layout];
  // Figma wires "Show secondaryButton" in the "Two button drawer" layout only.
  const showLeft = left !== null && leftCTA !== undefined && (layout !== 'Two button drawer' || showSecondaryButton);

  const row = (
    <div className="bottomCTA__row">
      {showLeft && <Button variant={left} size="L" CTA={leftCTA} onClick={onLeftClick} />}
      <Button variant={right} size="L" CTA={rightCTA} onClick={onRightClick} />
    </div>
  );

  return (
    <div className="bottomCTA" data-layout={layout}>
      {layout === 'Two button no drawer' ? row : <div className="bottomCTA__panel">{row}</div>}
    </div>
  );
}
