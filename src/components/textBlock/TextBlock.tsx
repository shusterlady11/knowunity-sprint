import './textBlock.css';

export type TextBlockVariant = 'XL' | 'L' | 'M' | 'S';

export type TextBlockProps = {
  variant?: TextBlockVariant;
  /** Figma's "showCaption": turn the caption line on or off. Only turn it on with real caption text. */
  showCaption?: boolean;
  /** Figma's "title". */
  title?: string;
  /** Figma's "caption". */
  caption?: string;
};

/** A title with an optional caption under it, in four sizes. It sets the text and doesn't choose a heading level. */
export function TextBlock({ variant = 'XL', showCaption = true, title = 'Header', caption = 'Caption' }: TextBlockProps) {
  return (
    <div className="textBlock" data-variant={variant}>
      <p className="textBlock__title">{title}</p>
      {showCaption && <p className="textBlock__caption">{caption}</p>}
    </div>
  );
}
