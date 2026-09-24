import type { ReactNode } from 'react';
import { BottomSheetAppBar } from '../bottomSheetAppBar/BottomSheetAppBar';
import type { BottomSheetAppBarProps } from '../bottomSheetAppBar/BottomSheetAppBar';
import './bottomSheet.css';

export type BottomSheetHeight = 'S' | 'M' | 'L';

export type BottomSheetProps = {
  /** Figma's design-time preview size. It has no effect: the sheet always hugs its content. */
  height?: BottomSheetHeight;
  /** The top bar's type, title, buttons and callbacks. Figma sets these on the nested bottomSheetAppBar. */
  appBar?: BottomSheetAppBarProps;
  /** Figma's middleSection slot: the content. */
  middleSection?: ReactNode;
  /** Figma's bottomSection slot: the actions. Left out, the section isn't drawn. */
  bottomSection?: ReactNode;
  /** The sheet's name for screen readers. Defaults to the top bar's title. */
  label?: string;
};

/**
 * A sheet for a short, secondary task. It fills the width it's given and hugs its content; the
 * screen's `bottomSheetOnly` slot places it at the bottom, over the scrim.
 */
export function BottomSheet({ appBar, middleSection, bottomSection, label }: BottomSheetProps) {
  const type = appBar?.type ?? 'Default';
  const name = label ?? (type === 'Default' ? undefined : (appBar?.title ?? 'Title'));

  return (
    <section className="bottomSheet" role="dialog" aria-label={name}>
      <BottomSheetAppBar {...appBar} />
      <div className="bottomSheet__middle">{middleSection}</div>
      {bottomSection != null && <div className="bottomSheet__bottom">{bottomSection}</div>}
    </section>
  );
}
