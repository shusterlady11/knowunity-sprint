import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconSlot } from '../iconSlot/IconSlot';
import type { IconSlotSize } from '../iconSlot/IconSlot';
import { LoadingIcon } from '../../icons/LoadingIcon';
// buttonIcon is the button's face without a label, so it reuses the button's styles and overrides only
// what differs (see buttonIcon.css). Import order matters: button.css first.
import '../button/button.css';
import './buttonIcon.css';

export type ButtonIconVariant = 'Primary' | 'Secondary' | 'Tertiary';
export type ButtonIconSize = 'S' | 'M' | 'L';
export type ButtonIconState = 'Default' | 'Pressed' | 'Disabled' | 'Loading';

export type ButtonIconProps = {
  variant?: ButtonIconVariant;
  size?: ButtonIconSize;
  state?: ButtonIconState;
  /** The icon to show, passed in as in Figma's icon container (for example XIcon). */
  icon: ReactNode;
  /** Required: with no text label, this is the button's only name for screen readers. */
  'aria-label': string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled' | 'aria-label'>;

const iconSizeFor: Record<ButtonIconSize, IconSlotSize> = { S: '200', M: '250', L: '300' };

export function ButtonIcon({
  variant = 'Primary',
  size = 'S',
  state = 'Default',
  icon,
  type = 'button',
  onClick,
  ...rest
}: ButtonIconProps) {
  const isLoading = state === 'Loading';

  return (
    <button
      {...rest}
      type={type}
      className="button buttonIcon"
      data-variant={variant}
      data-size={size}
      data-state={state}
      disabled={state === 'Disabled'}
      aria-busy={isLoading || undefined}
      aria-disabled={isLoading || undefined}
      onClick={isLoading ? undefined : onClick}
    >
      <span className="button__face">
        <IconSlot size={iconSizeFor[size]}>{isLoading ? <LoadingIcon className="button__spinner" /> : icon}</IconSlot>
      </span>
    </button>
  );
}
