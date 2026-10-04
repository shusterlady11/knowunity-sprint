import type { ReactNode } from 'react';
import { Scaffold } from '../components/scaffold/Scaffold';
import { MascotSlot, type MascotSlotProps } from '../components/mascotSlot/MascotSlot';
import { TextBlock } from '../components/textBlock/TextBlock';
import './messageScreen.css';

/**
 * A plain message: Knowie, a headline and a line under it, centered, with optional actions at the bottom.
 * No Figma frame; composed like the first-run splash. Used by the entry link's install steps and unknown
 * link, and by /reset.
 */
export function MessageScreen({
  expression,
  title,
  caption,
  actions,
}: {
  expression: MascotSlotProps['expression'];
  title: string;
  caption: string;
  actions?: ReactNode;
}) {
  return (
    <Scaffold
      showTopNavSlot={false}
      showBottomNavSlot={actions != null}
      middleContent={
        <div className="messageScreen__content">
          <MascotSlot size="2XL" expression={expression} />
          {/* TextBlock doesn't choose a heading level, so the screen marks its title as the page heading. */}
          <div role="heading" aria-level={1}>
            <TextBlock variant="L" title={title} caption={caption} />
          </div>
        </div>
      }
      bottomContent={actions != null ? <div className="messageScreen__actions">{actions}</div> : undefined}
    />
  );
}
