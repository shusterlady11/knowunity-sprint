import type { ReactNode } from 'react';
import './buttonGroup.css';

export type ButtonGroupVariant = 'Horizontal' | 'Vertical';
export type ButtonGroupSize = 'M' | 'L';

export type ButtonGroupProps = {
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  /** The buttons (and at most one buttonIcon, first in a Horizontal group). Give them the same size as the group. */
  children: ReactNode;
};

/** A row or column of related actions with consistent spacing. It only lays them out; the buttons are the `button` and `buttonIcon` components. */
export function ButtonGroup({ variant = 'Vertical', size = 'M', children }: ButtonGroupProps) {
  return (
    <div className="buttonGroup" role="group" data-variant={variant} data-size={size}>
      {children}
    </div>
  );
}
