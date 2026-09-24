import type { ReactNode } from 'react';
import './scaffold.css';

// Figma's scaffold has eight device sizes; only the phone the prototype is drawn for is built (390 wide).
export type ScaffoldSize = 'iPhone 13';

export type ScaffoldProps = {
  size?: ScaffoldSize;
  /** Figma's topNavigation slot: the screen's nav row, usually an appBar. */
  topNavigation?: ReactNode;
  /** Figma's middleContent slot: the screen's content. The only slot that scrolls. */
  middleContent?: ReactNode;
  /** Figma's bottomContent slot: the screen's primary actions, pinned to the bottom. */
  bottomContent?: ReactNode;
  /** Figma's bottomSheetOnly slot: a bottomSheet, placed at the bottom over everything else. */
  bottomSheetOnly?: ReactNode;
  /** Figma's "showTopNavSlot": draw the top navigation slot. */
  showTopNavSlot?: boolean;
  /** Figma's "showBottomNavSlot": draw the bottom content slot. */
  showBottomNavSlot?: boolean;
  /** Figma's "showBottomSheetBackground": darken the screen behind a sheet with the scrim. */
  showBottomSheetBackground?: boolean;
};

/**
 * The frame every screen is built from: a reserved status area, then the top navigation, the content, and
 * the bottom actions, with a scrim and a bottom sheet that float over them. It fills the space it's given.
 */
export function Scaffold({
  topNavigation,
  middleContent,
  bottomContent,
  bottomSheetOnly,
  showTopNavSlot = true,
  showBottomNavSlot = true,
  showBottomSheetBackground = false,
}: ScaffoldProps) {
  return (
    <div className="scaffold" data-size="iPhone 13">
      {/* The status bar is system UI and isn't built; its height is kept so everything lines up with Figma. */}
      <div className="scaffold__statusArea" aria-hidden="true" />
      {showTopNavSlot && <div className="scaffold__topNavigation">{topNavigation}</div>}
      <main className="scaffold__middleContent">{middleContent}</main>
      {showBottomNavSlot && <div className="scaffold__bottomContent">{bottomContent}</div>}
      {showBottomSheetBackground && <div className="scaffold__scrim" aria-hidden="true" />}
      {bottomSheetOnly != null && <div className="scaffold__bottomSheetOnly">{bottomSheetOnly}</div>}
    </div>
  );
}
