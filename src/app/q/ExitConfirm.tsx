'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BottomSheet } from '../../components/bottomSheet/BottomSheet';
import { TextBlock } from '../../components/textBlock/TextBlock';
import { ButtonGroup } from '../../components/buttonGroup/ButtonGroup';
import { Button } from '../../components/button/Button';

/**
 * The exit confirm that the close X opens on every /q/... route (SPEC.md › Exit confirm). No Figma frame;
 * composed like the mic permission sheet. Goes in Scaffold's bottomSheetOnly slot while it's open.
 */
export function ExitConfirm({ onKeepGoing }: { onKeepGoing: () => void }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  // Focus moves into the sheet and Escape closes it; closing hands focus back to the X.
  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onKeepGoing();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.querySelector<HTMLElement>('.appBar .buttonIcon')?.focus();
    };
  }, [onKeepGoing]);

  return (
    <div ref={ref} className="exitConfirm">
      <BottomSheet
        appBar={{ type: 'Default' }}
        label="Leave?"
        middleSection={<TextBlock variant="L" title="Leave?" caption="Your progress is saved." />}
        bottomSection={
          <ButtonGroup variant="Vertical" size="L">
            <Button variant="Primary" size="L" CTA="Keep going" onClick={onKeepGoing} />
            <Button variant="Secondary" size="L" CTA="Leave" onClick={() => router.push('/done')} />
          </ButtonGroup>
        }
      />
    </div>
  );
}
