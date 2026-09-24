import type { ReactNode } from 'react';
import { resolveVar } from './tokenData';
import type { Token } from './tokenData';

export function Description({ text }: { text: string | null }) {
  if (text) return <p className="fd-text">{text}</p>;
  return <p className="fd-text fd-missing">No description in tokens.json.</p>;
}

export function ResolvedValue({ cssVar }: { cssVar: string }) {
  const value = resolveVar(cssVar);
  if (value) return <p className="fd-value">{value}</p>;
  return <p className="fd-value fd-error">Not found in tokens.css. Run npm run tokens.</p>;
}

export function TokenRow({ token, visual, wide = false }: { token: Token; visual: ReactNode; wide?: boolean }) {
  return (
    <article className={wide ? 'fd-space-row fd-space-row-wide' : 'fd-space-row'} data-token={token.dotName}>
      <div className="fd-row-visual">{visual}</div>
      <div>
        <h3 className="fd-name">{token.dotName}</h3>
        <p className="fd-value">{token.cssVar}</p>
        <ResolvedValue cssVar={token.cssVar} />
        <Description text={token.description} />
      </div>
    </article>
  );
}
