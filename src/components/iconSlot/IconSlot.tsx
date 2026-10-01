import type { ReactNode } from 'react';
import './iconSlot.css';

export type IconSlotSize = '100' | '150' | '200' | '250' | '300' | '400';

export type IconSlotProps = {
  size?: IconSlotSize;
  children?: ReactNode;
};

/** Holds an icon at a fixed size, nested inside other components. The icon takes the text color around it. */
export function IconSlot({ size = '400', children }: IconSlotProps) {
  return (
    <span className="iconSlot" data-size={size} aria-hidden="true">
      {children}
    </span>
  );
}
