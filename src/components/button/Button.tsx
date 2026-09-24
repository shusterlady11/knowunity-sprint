import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconSlot } from '../iconSlot/IconSlot';
import type { IconSlotSize } from '../iconSlot/IconSlot';
import { LoadingIcon } from '../../icons/LoadingIcon';
import './button.css';

export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary';
export type ButtonSize = 'S' | 'M' | 'L';
export type ButtonState = 'Default' | 'Pressed' | 'Disabled' | 'Loading';

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  CTA: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled'>;

const iconSizeFor: Record<ButtonSize, IconSlotSize> = { S: '200', M: '250', L: '300' };

export function Button({
  variant = 'Primary',
  size = 'S',
  state = 'Default',
  showLeftIcon = false,
  showRightIcon = false,
  CTA,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  const isLoading = state === 'Loading';
  const iconSize = iconSizeFor[size];

  return (
    <button
      {...rest}
      type={type}
      className="button"
      data-variant={variant}
      data-size={size}
      data-state={state}
      disabled={state === 'Disabled'}
      aria-busy={isLoading || undefined}
      aria-disabled={isLoading || undefined}
      aria-label={isLoading ? CTA : undefined}
      onClick={isLoading ? undefined : onClick}
    >
      <span className="button__face">
        {isLoading ? (
          <IconSlot size={iconSize}>
            <LoadingIcon className="button__spinner" />
          </IconSlot>
        ) : (
          <>
            {showLeftIcon && <IconSlot size={iconSize}>{leftIcon}</IconSlot>}
            <span className="button__label">{CTA}</span>
            {showRightIcon && <IconSlot size={iconSize}>{rightIcon}</IconSlot>}
          </>
        )}
      </span>
    </button>
  );
}
