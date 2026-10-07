import './headlineBlock.css';

export type HeadlineBlockBodyStyle = 'headlineS' | 'bodyM';
export type HeadlineBlockBodyEmphasis = 'secondary' | 'primary';

export type HeadlineBlockProps = {
  /** Figma's "showTitle": turn the Headline L title on or off. Off, the block is a single line. */
  showTitle?: boolean;
  /** Figma's "title". */
  title?: string;
  /** Figma's "body": the line under the title, or the only line. */
  body?: string;
  /** Figma's "bodyStyle": the body's type style, Headline S or Body M Regular. */
  bodyStyle?: HeadlineBlockBodyStyle;
  /** Figma's "bodyEmphasis": the body's color, text/secondary or text/primary. */
  bodyEmphasis?: HeadlineBlockBodyEmphasis;
};

/**
 * Centered message text: a Headline L title with a line under it, or a single line on its own. It sets the
 * text and doesn't choose a heading level.
 */
export function HeadlineBlock({
  showTitle = true,
  title = 'Header',
  body = 'Body',
  bodyStyle = 'headlineS',
  bodyEmphasis = 'secondary',
}: HeadlineBlockProps) {
  return (
    <div className="headlineBlock" data-body-style={bodyStyle} data-body-emphasis={bodyEmphasis}>
      {showTitle && <p className="headlineBlock__title">{title}</p>}
      <p className="headlineBlock__body">{body}</p>
    </div>
  );
}
