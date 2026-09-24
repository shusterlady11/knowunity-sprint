import type { ReactNode } from 'react';
import { ArrowRightIcon } from '../../icons/ArrowRightIcon';
import { XIcon } from '../../icons/XIcon';
import { ButtonIcon } from '../buttonIcon/ButtonIcon';
import './bottomSheetAppBar.css';

// Figma's property is "Type"; the options keep Figma's names.
export type BottomSheetAppBarType = 'Default' | 'withTitle' | 'dismissOnly' | 'dismissAndAction';

export type BottomSheetAppBarProps = {
  type?: BottomSheetAppBarType;
  /** Figma's "Title". Shown in every type except Default. */
  title?: string;
  /** Figma's "showCaption": show the sub-title under the title. */
  showCaption?: boolean;
  /** Figma's "Caption". */
  caption?: string;
  /** The icon on the left button (dismissOnly and dismissAndAction). Figma's dismissButton, an x-close by default. */
  dismissIcon?: ReactNode;
  /** The icon on the right button (dismissAndAction). Figma's actionButton, an arrow-right by default. */
  actionIcon?: ReactNode;
  /** The left button's name for screen readers. */
  dismissLabel?: string;
  /** The right button's name for screen readers. */
  actionLabel?: string;
  onDismiss?: () => void;
  onAction?: () => void;
};

/** The top of a bottomSheet: a drag handle and, by type, a title and side buttons. Use it only inside a bottomSheet. */
export function BottomSheetAppBar({
  type = 'Default',
  title = 'Title',
  showCaption = false,
  caption = 'Sub-title (optional)',
  dismissIcon = <XIcon />,
  actionIcon = <ArrowRightIcon />,
  dismissLabel = 'Close',
  actionLabel = 'Next',
  onDismiss,
  onAction,
}: BottomSheetAppBarProps) {
  const hasTitle = type !== 'Default';
  const hasDismiss = type === 'dismissOnly' || type === 'dismissAndAction';

  return (
    <div className="bottomSheetAppBar" data-type={type}>
      <span className="bottomSheetAppBar__handle" aria-hidden="true" />
      <div className="bottomSheetAppBar__nav">
        {hasDismiss && (
          <ButtonIcon variant="Tertiary" size="M" icon={dismissIcon} aria-label={dismissLabel} onClick={onDismiss} />
        )}
        {hasTitle && (
          <div className="bottomSheetAppBar__text">
            <p className="bottomSheetAppBar__title">{title}</p>
            {showCaption && <p className="bottomSheetAppBar__caption">{caption}</p>}
          </div>
        )}
        {/* Keeps the title centered when there is a button on the left only. */}
        {type === 'dismissOnly' && <span className="bottomSheetAppBar__spacer" aria-hidden="true" />}
        {type === 'dismissAndAction' && (
          <ButtonIcon variant="Tertiary" size="M" icon={actionIcon} aria-label={actionLabel} onClick={onAction} />
        )}
      </div>
    </div>
  );
}
